package models

import "time"

// Request represents an HTTP / REST / GraphQL request definition.
type Request struct {
	ID          string            `json:"id"`
	Name        string            `json:"name"`
	Method      string            `json:"method"`
	URL         string            `json:"url"`
	Headers     map[string]string `json:"headers"`
	QueryParams map[string]string `json:"queryParams"`
	Body        string            `json:"body"`
	AuthType    string            `json:"authType"` // none, bearer, basic, apikey
	AuthToken   string            `json:"authToken,omitempty"`
}

// Response captures complete execution telemetry and payload.
type Response struct {
	StatusCode    int               `json:"statusCode"`
	StatusText    string            `json:"statusText"`
	Headers       map[string]string `json:"headers"`
	Body          string            `json:"body"`
	DurationMs    int64             `json:"durationMs"`
	SizeBytes     int64             `json:"sizeBytes"`
	ContentType   string            `json:"contentType"`
	ExecutionTime time.Time         `json:"executionTime"`
	Error         string            `json:"error,omitempty"`
}
