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
func NewPmseriesAPI(url string, basicAuth *BasicAuthSettings) API {
	return &pmseriesAPI{
		url:       url,
		basicAuth: basicAuth,
		client: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (e *ApiError) Unwrap() error { return e.Err }
func (e *ApiError) Error() string {
	var urlError *url.Error
	if errors.As(e.Err, &urlError) {
		if urlError.Timeout() {
			return fmt.Sprintf("Timeout while connecting to %s", urlError.URL)
		}
		return fmt.Sprintf("Network Error: %s", urlError.Error())
	}
	return e.Err.Error()
}

func (api *pmseriesAPI) doRequest(path string, params url.Values, response interface{}) error {
	url := api.url + path
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return &ApiError{URL: url, Err: err}
	}

	if api.basicAuth != nil {
		req.SetBasicAuth(api.basicAuth.Username, api.basicAuth.Password)
	}

	req.URL.RawQuery = params.Encode()
	log.DefaultLogger.Debug("HTTP Request", "url", req.URL.String())
	resp, err := api.client.Do(req)
	if err != nil {
		log.DefaultLogger.Error("HTTP Response", "url", req.URL.String(), "err", err)
		return &ApiError{URL: req.URL.String(), Err: err}
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		bodyBytes, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return &ApiError{URL: req.URL.String(), StatusCode: resp.StatusCode, Err: err}
		}
		bodyStr := string(bodyBytes)
		log.DefaultLogger.Error("HTTP Response", "url", req.URL.String(), "code", resp.StatusCode, "data", bodyStr)
		return &ApiError{
			URL:        req.URL.String(),
			StatusCode: resp.StatusCode,
			Response:   bodyStr,
			Err:        fmt.Errorf("HTTP Error %d", resp.StatusCode),
		}
	}

	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		log.DefaultLogger.Error("HTTP Response", "url", req.URL.String(), "code", resp.StatusCode, "err", err)
		return &ApiError{
			URL:        req.URL.String(),
			StatusCode: resp.StatusCode,
			Err:        err,
		}
	}
	//log.DefaultLogger.Debug("HTTP response", "url", req.URL.String(), "code", resp.StatusCode, "response", response)
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
