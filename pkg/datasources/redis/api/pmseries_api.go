package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

// PmseriesAPI contains basic API infos
type PmseriesAPI struct {
	URL    string
	Client http.Client
}

// NewPmseriesAPI constructs a new PmseriesAPI struct
func NewPmseriesAPI(url string) *PmseriesAPI {
	return &PmseriesAPI{
		URL:    url,
		Client: http.Client{},
	}
}

func (api *PmseriesAPI) doRequest(url string, params url.Values, response interface{}) error {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return err
	}

	req.URL.RawQuery = params.Encode()
	log.DefaultLogger.Debug("HTTP Request", "url", req.URL.String())
	resp, err := api.Client.Do(req)
	if err != nil {
		log.DefaultLogger.Error("HTTP Response", "url", req.URL.String(), "err", err)
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		bodyBytes, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return err
		}
		bodyStr := string(bodyBytes)
		log.DefaultLogger.Error("HTTP Response", "url", req.URL.String(), "code", resp.StatusCode, "data", bodyStr)
		return errors.New(bodyStr)
	}

	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		log.DefaultLogger.Error("HTTP Response", "url", req.URL.String(), "code", resp.StatusCode, "err", err)
		return err
	}
	//log.DefaultLogger.Debug("HTTP response", "url", req.URL.String(), "code", resp.StatusCode, "response", response)
	return nil
}

func (api *PmseriesAPI) Query(expr string) (QueryResponse, error) {
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

func (api *PmseriesAPI) Metrics(series []string) ([]MetricsResponseItem, error) {
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

func (api *PmseriesAPI) MetricNameMatches(match string) (MetricNameMatchesResponse, error) {
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

func (api *PmseriesAPI) Descs(series []string) ([]DescsResponseItem, error) {
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

func (api *PmseriesAPI) Instances(series []string) ([]InstancesResponseItem, error) {
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

func (api *PmseriesAPI) Labels(series []string) ([]LabelsResponseItem, error) {
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

func (api *PmseriesAPI) LabelValues(names []string) (LabelNamesResponse, error) {
	var resp LabelNamesResponse
	err := api.doRequest(
		fmt.Sprintf("%s/series/labels", api.URL),
		url.Values{
			"names": []string{strings.Join(names, ",")},
		},
		&resp,
	)
	return resp, err
}

func (api *PmseriesAPI) Values(series []string, start int64, finish int64, interval int64) ([]ValuesResponseItem, error) {
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
