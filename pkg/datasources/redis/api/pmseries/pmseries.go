package pmseries

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

type API interface {
	Ping() (GenericSuccessResponse, error)
	Query(expr string) (QueryResponse, error)
	Metrics(series []string) ([]MetricsResponseItem, error)
	MetricNames(pattern string) (MetricNamesResponse, error)
	Descs(series []string) ([]DescsResponseItem, error)
	Instances(series []string) ([]InstancesResponseItem, error)
	Labels(series []string) ([]LabelsResponseItem, error)
	LabelNames(pattern string) (LabelNamesResponse, error)
	LabelValues(labelNames []string) (LabelValuesResponse, error)
	Values(series []string, start int64, finish int64, interval int64) ([]ValuesResponseItem, error)
}

type pmseriesAPI struct {
	url       string
	basicAuth *BasicAuthSettings
	client    *http.Client
}

type BasicAuthSettings struct {
	Username string
	Password string
}

// NewPmseriesAPI constructs a new PmseriesAPI struct
func NewPmseriesAPI(pmproxyUrl string, basicAuth *BasicAuthSettings) (API, error) {
	_, err := url.ParseRequestURI(pmproxyUrl)
	if err != nil {
		return nil, fmt.Errorf("invalid URL: %w", err)
	}

	return &pmseriesAPI{
		url:       pmproxyUrl,
		basicAuth: basicAuth,
		client: &http.Client{
			Timeout: 1 * time.Minute,
		},
	}, nil
}

func (api *pmseriesAPI) doRequest(path string, params url.Values, response interface{}) error {
	var req *http.Request
	var err error
	absURL := api.url + path
	paramsEncoded := params.Encode()

	// send a HTTP GET request if the URL length is less than 8192, and a HTTP POST request otherwise
	if len(absURL)+1+len(paramsEncoded) < 8192 {
		req, err = http.NewRequest("GET", absURL, nil)
		if err != nil {
			log.DefaultLogger.Error("error creating a HTTP GET request", "url", absURL, "err", err)
			return fmt.Errorf("error creating a HTTP GET request for '%s': %w", absURL, err)
		}
		req.URL.RawQuery = paramsEncoded
	} else {
		// pmproxy accepts parameters in the request body since PCP v6+
		// https://github.com/performancecopilot/pcp/commit/87564eb9907ba6ca517d18c31c32591b64659c10
		req, err = http.NewRequest("POST", absURL, strings.NewReader(paramsEncoded))
		if err != nil {
			log.DefaultLogger.Error("error creating a HTTP POST request", "url", absURL, "params", paramsEncoded, "err", err)
			return fmt.Errorf("error creating a HTTP POST request for '%s': %w", absURL, err)
		}
	}
	if api.basicAuth != nil {
		req.SetBasicAuth(api.basicAuth.Username, api.basicAuth.Password)
	}

	// send HTTP request
	log.DefaultLogger.Debug("sending pmproxy REST API request", "url", req.URL.String(), "method", req.Method, "params", paramsEncoded)
	resp, err := api.client.Do(req)
	if err != nil {
		log.DefaultLogger.Error("error sending pmproxy REST API request", "url", req.URL.String(), "params", paramsEncoded, "err", err)

		var urlError *url.Error
		if errors.As(err, &urlError) {
			if urlError.Timeout() {
				return fmt.Errorf("timeout while connecting to '%s'", req.URL.String())
			}
		}
		return fmt.Errorf("network error: %w", err)
	}
	defer resp.Body.Close()

	// HTTP request was successful, but pmproxy returned non-200 status code
	if resp.StatusCode != 200 {
		bodyBytes, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return fmt.Errorf("cannot read HTTP response: %w", err)
		}
		bodyStr := string(bodyBytes)
		log.DefaultLogger.Error("received a HTTP error response from pmproxy", "url", req.URL.String(), "code", resp.StatusCode, "params", paramsEncoded, "data", bodyStr)

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

func (api *pmseriesAPI) Ping() (GenericSuccessResponse, error) {
	var resp GenericSuccessResponse
	err := api.doRequest(
		"/series/ping",
		url.Values{},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) Query(expr string) (QueryResponse, error) {
	var resp QueryResponse
	err := api.doRequest(
		"/series/query",
		url.Values{
			"expr": []string{expr},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) Metrics(series []string) ([]MetricsResponseItem, error) {
	var resp []MetricsResponseItem
	err := api.doRequest(
		"/series/metrics",
		url.Values{
			"series": []string{strings.Join(series, ",")},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) MetricNames(pattern string) (MetricNamesResponse, error) {
	var resp MetricNamesResponse
	err := api.doRequest(
		"/series/metrics",
		url.Values{
			"match": []string{pattern},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) Descs(series []string) ([]DescsResponseItem, error) {
	var resp []DescsResponseItem
	err := api.doRequest(
		"/series/descs",
		url.Values{
			"series": []string{strings.Join(series, ",")},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) Instances(series []string) ([]InstancesResponseItem, error) {
	var resp []InstancesResponseItem
	err := api.doRequest(
		"/series/instances",
		url.Values{
			"series": []string{strings.Join(series, ",")},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) Labels(series []string) ([]LabelsResponseItem, error) {
	var resp []LabelsResponseItem
	err := api.doRequest(
		"/series/labels",
		url.Values{
			"series": []string{strings.Join(series, ",")},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) LabelNames(pattern string) (LabelNamesResponse, error) {
	var resp LabelNamesResponse
	err := api.doRequest(
		"/series/labels",
		url.Values{
			"match": []string{pattern},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) LabelValues(labelNames []string) (LabelValuesResponse, error) {
	var resp LabelValuesResponse
	err := api.doRequest(
		"/series/labels",
		url.Values{
			"names": []string{strings.Join(labelNames, ",")},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) Values(series []string, start int64, finish int64, interval int64) ([]ValuesResponseItem, error) {
	var resp []ValuesResponseItem
	err := api.doRequest(
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
