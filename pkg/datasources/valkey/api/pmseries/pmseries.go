package pmseries

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

type API interface {
	Ping(ctx context.Context) (GenericSuccessResponse, error)
	Query(ctx context.Context, expr string) (QueryResponse, error)
	Metrics(ctx context.Context, series []string) ([]MetricsResponseItem, error)
	MetricNames(ctx context.Context, pattern string) (MetricNamesResponse, error)
	Descs(ctx context.Context, series []string) ([]DescsResponseItem, error)
	Instances(ctx context.Context, series []string) ([]InstancesResponseItem, error)
	Labels(ctx context.Context, series []string) ([]LabelsResponseItem, error)
	LabelNames(ctx context.Context, pattern string) (LabelNamesResponse, error)
	LabelValues(ctx context.Context, labelNames []string) (LabelValuesResponse, error)
	Values(ctx context.Context, series []string, start int64, finish int64, interval int64) ([]ValuesResponseItem, error)
}

type pmseriesAPI struct {
	url    string
	client *http.Client
}

// NewPmseriesAPI constructs a new PmseriesAPI struct
func NewPmseriesAPI(pmproxyUrl string, client *http.Client) (API, error) {
	_, err := url.ParseRequestURI(pmproxyUrl)
	if err != nil {
		return nil, fmt.Errorf("invalid URL: %w", err)
	}

	return &pmseriesAPI{
		url:    pmproxyUrl,
		client: client,
	}, nil
}

// doRequest sends a context-bound pmproxy request and decodes its response.
func (api *pmseriesAPI) doRequest(ctx context.Context, path string, params url.Values, response interface{}) error {
	var req *http.Request
	var err error
	absURL := api.url + path
	paramsEncoded := params.Encode()

	// send a HTTP GET request if the URL length is less than 8192, and a HTTP POST request otherwise
	if len(absURL)+1+len(paramsEncoded) < 8192 {
		req, err = http.NewRequestWithContext(ctx, "GET", absURL, nil)
		if err != nil {
			log.DefaultLogger.Error("error creating a HTTP GET request", "url", absURL, "err", err)
			return fmt.Errorf("error creating a HTTP GET request for '%s': %w", absURL, err)
		}
		req.URL.RawQuery = paramsEncoded
	} else {
		// pmproxy accepts parameters in the request body since PCP v6+
		// https://github.com/performancecopilot/pcp/commit/87564eb9907ba6ca517d18c31c32591b64659c10
		req, err = http.NewRequestWithContext(ctx, "POST", absURL, strings.NewReader(paramsEncoded))
		if err != nil {
			log.DefaultLogger.Error("error creating a HTTP POST request", "url", absURL, "params", paramsEncoded, "err", err)
			return fmt.Errorf("error creating a HTTP POST request for '%s': %w", absURL, err)
		}
	}

	// send HTTP request
	log.DefaultLogger.Debug("sending pmproxy REST API request", "url", req.URL.String(), "method", req.Method, "params", paramsEncoded)
	resp, err := api.client.Do(req)
	if err != nil {
		log.DefaultLogger.Error("error sending pmproxy REST API request", "url", req.URL.String(), "params", paramsEncoded, "err", err)

		var urlError *url.Error
		if errors.As(err, &urlError) {
			if urlError.Timeout() {
				return fmt.Errorf("timeout while connecting to '%s': %w", req.URL.String(), err)
			}
		}
		return fmt.Errorf("network error: %w", err)
	}
	defer resp.Body.Close()

	// HTTP request was successful, but pmproxy returned non-200 status code
	if resp.StatusCode != 200 {
		bodyBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			return fmt.Errorf("cannot read HTTP response: %w", err)
		}
		log.DefaultLogger.Error("received a HTTP error response from pmproxy", "code", resp.StatusCode, "status", http.StatusText(resp.StatusCode))
		log.DefaultLogger.Debug("pmproxy HTTP error response body", "code", resp.StatusCode, "data", string(bodyBytes))

		var genericErrorResponse GenericErrorResponse
		err = json.Unmarshal(bodyBytes, &genericErrorResponse)
		if err != nil {
			return fmt.Errorf("cannot unmarshal error response: %w", err)
		}
		return errors.New(genericErrorResponse.Message)
	}

	// HTTP request was successful, 200 status code
	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		log.DefaultLogger.Error("cannot unmarshal response from pmproxy", "url", req.URL.String(), "code", resp.StatusCode, "params", paramsEncoded, "err", err)
		return fmt.Errorf("cannot unmarshal response from pmproxy: %w", err)
	}
	//log.DefaultLogger.Debug("received a response from pmproxy", "url", req.URL.String(), "code", resp.StatusCode, "response", response)
	return nil
}

func (api *pmseriesAPI) Ping(ctx context.Context) (GenericSuccessResponse, error) {
	var resp GenericSuccessResponse
	err := api.doRequest(
		ctx,
		"/series/ping",
		url.Values{},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) Query(ctx context.Context, expr string) (QueryResponse, error) {
	var resp QueryResponse
	err := api.doRequest(
		ctx,
		"/series/query",
		url.Values{
			"expr": []string{expr},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) Metrics(ctx context.Context, series []string) ([]MetricsResponseItem, error) {
	var resp []MetricsResponseItem
	err := api.doRequest(
		ctx,
		"/series/metrics",
		url.Values{
			"series": []string{strings.Join(series, ",")},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) MetricNames(ctx context.Context, pattern string) (MetricNamesResponse, error) {
	var resp MetricNamesResponse
	err := api.doRequest(
		ctx,
		"/series/metrics",
		url.Values{
			"match": []string{pattern},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) Descs(ctx context.Context, series []string) ([]DescsResponseItem, error) {
	var resp []DescsResponseItem
	err := api.doRequest(
		ctx,
		"/series/descs",
		url.Values{
			"series": []string{strings.Join(series, ",")},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) Instances(ctx context.Context, series []string) ([]InstancesResponseItem, error) {
	var resp []InstancesResponseItem
	err := api.doRequest(
		ctx,
		"/series/instances",
		url.Values{
			"series": []string{strings.Join(series, ",")},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) Labels(ctx context.Context, series []string) ([]LabelsResponseItem, error) {
	var resp []LabelsResponseItem
	err := api.doRequest(
		ctx,
		"/series/labels",
		url.Values{
			"series": []string{strings.Join(series, ",")},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) LabelNames(ctx context.Context, pattern string) (LabelNamesResponse, error) {
	var resp LabelNamesResponse
	err := api.doRequest(
		ctx,
		"/series/labels",
		url.Values{
			"match": []string{pattern},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) LabelValues(ctx context.Context, labelNames []string) (LabelValuesResponse, error) {
	var resp LabelValuesResponse
	err := api.doRequest(
		ctx,
		"/series/labels",
		url.Values{
			"names": []string{strings.Join(labelNames, ",")},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) Values(ctx context.Context, series []string, start int64, finish int64, interval int64) ([]ValuesResponseItem, error) {
	var resp []ValuesResponseItem
	err := api.doRequest(
		ctx,
		"/series/values",
		url.Values{
			"series":   []string{strings.Join(series, ",")},
			"start":    []string{strconv.FormatInt(start, 10)},
			"finish":   []string{strconv.FormatInt(finish, 10)},
			"interval": []string{strconv.FormatInt(interval, 10)},
		},
		&resp,
	)
	return resp, err
}
