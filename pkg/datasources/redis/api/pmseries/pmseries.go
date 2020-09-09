package pmseries

import (
	"encoding/json"
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
	MetricNameMatches(match string) (MetricNameMatchesResponse, error)
	Descs(series []string) ([]DescsResponseItem, error)
	Instances(series []string) ([]InstancesResponseItem, error)
	Labels(series []string) ([]LabelsResponseItem, error)
	LabelNames() (LabelNamesResponse, error)
	LabelValues(labelNames []string) (LabelValuesResponse, error)
	Values(series []string, start int64, finish int64, interval int64) ([]ValuesResponseItem, error)
}

type pmseriesAPI struct {
	URL    string
	Client *http.Client
}

// NewPmseriesAPI constructs a new PmseriesAPI struct
func NewPmseriesAPI(url string) API {
	return &pmseriesAPI{
		URL: url,
		Client: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (api *pmseriesAPI) doRequest(url string, params url.Values, response interface{}) error {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return &Error{URL: url, Err: err}
	}

	req.URL.RawQuery = params.Encode()
	log.DefaultLogger.Debug("HTTP Request", "url", req.URL.String())
	resp, err := api.Client.Do(req)
	if err != nil {
		log.DefaultLogger.Error("HTTP Response", "url", req.URL.String(), "err", err)
		return &Error{URL: req.URL.String(), Err: err}
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		bodyBytes, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return &Error{URL: req.URL.String(), StatusCode: resp.StatusCode, Err: err}
		}
		bodyStr := string(bodyBytes)
		log.DefaultLogger.Error("HTTP Response", "url", req.URL.String(), "code", resp.StatusCode, "data", bodyStr)
		return &Error{
			URL:        req.URL.String(),
			StatusCode: resp.StatusCode,
			Response:   bodyStr,
			Err:        fmt.Errorf("HTTP Error %d", resp.StatusCode),
		}
	}

	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		log.DefaultLogger.Error("HTTP Response", "url", req.URL.String(), "code", resp.StatusCode, "err", err)
		return &Error{
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
		fmt.Sprintf("%s/series/ping", api.URL),
		url.Values{},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) Query(expr string) (QueryResponse, error) {
	var resp QueryResponse
	err := api.doRequest(
		fmt.Sprintf("%s/series/query", api.URL),
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
		fmt.Sprintf("%s/series/metrics", api.URL),
		url.Values{
			"series": []string{strings.Join(series, ",")},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) MetricNameMatches(match string) (MetricNameMatchesResponse, error) {
	var resp MetricNameMatchesResponse
	err := api.doRequest(
		fmt.Sprintf("%s/series/metrics", api.URL),
		url.Values{
			"match": []string{match},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) Descs(series []string) ([]DescsResponseItem, error) {
	var resp []DescsResponseItem
	err := api.doRequest(
		fmt.Sprintf("%s/series/descs", api.URL),
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
		fmt.Sprintf("%s/series/instances", api.URL),
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
		fmt.Sprintf("%s/series/labels", api.URL),
		url.Values{
			"series": []string{strings.Join(series, ",")},
		},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) LabelNames() (LabelNamesResponse, error) {
	var resp LabelNamesResponse
	err := api.doRequest(
		fmt.Sprintf("%s/series/labels", api.URL),
		url.Values{},
		&resp,
	)
	return resp, err
}

func (api *pmseriesAPI) LabelValues(labelNames []string) (LabelValuesResponse, error) {
	var resp LabelValuesResponse
	err := api.doRequest(
		fmt.Sprintf("%s/series/labels", api.URL),
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
		fmt.Sprintf("%s/series/values", api.URL),
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
