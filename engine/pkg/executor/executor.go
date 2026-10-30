package executor

import (
	"context"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/ForgeNexa/forge-api/engine/pkg/models"
)

// Engine executes API requests with connection pooling and telemetry.
type Engine struct {
	client *http.Client
}

// NewEngine initializes an API execution engine.
func NewEngine(timeout time.Duration) *Engine {
	if timeout <= 0 {
		timeout = 30 * time.Second
	}
	return &Engine{
		client: &http.Client{
			Timeout: timeout,
			Transport: &http.Transport{
				MaxIdleConns:        100,
				MaxIdleConnsPerHost: 20,
				IdleConnTimeout:     90 * time.Second,
			},
		},
	}
}

// Execute runs the request definition and captures timing, headers, and body.
func (e *Engine) Execute(ctx context.Context, reqDef models.Request) (*models.Response, error) {
	parsedURL, err := url.Parse(reqDef.URL)
	if err != nil {
		return nil, err
	}

	// Append query parameters
	if len(reqDef.QueryParams) > 0 {
		q := parsedURL.Query()
		for k, v := range reqDef.QueryParams {
			q.Add(k, v)
		}
		parsedURL.RawQuery = q.Encode()
	}

	var bodyReader io.Reader
	if len(reqDef.Body) > 0 {
		bodyReader = strings.NewReader(reqDef.Body)
	}

	httpReq, err := http.NewRequestWithContext(ctx, reqDef.Method, parsedURL.String(), bodyReader)
	if err != nil {
		return nil, err
	}

	// Apply custom headers
	for k, v := range reqDef.Headers {
		httpReq.Header.Set(k, v)
	}

	// Apply authentication
	switch reqDef.AuthType {
	case "bearer":
		if reqDef.AuthToken != "" {
			httpReq.Header.Set("Authorization", "Bearer "+reqDef.AuthToken)
		}
	}

	start := time.Now()
	resp, err := e.client.Do(httpReq)
	duration := time.Since(start).Milliseconds()

	if err != nil {
		return &models.Response{
			DurationMs:    duration,
			ExecutionTime: time.Now(),
			Error:         err.Error(),
		}, err
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	respHeaders := make(map[string]string)
	for k, v := range resp.Header {
		if len(v) > 0 {
			respHeaders[k] = v[0]
		}
	}

	return &models.Response{
		StatusCode:    resp.StatusCode,
		StatusText:    resp.Status,
		Headers:       respHeaders,
		Body:          string(bodyBytes),
		DurationMs:    duration,
		SizeBytes:     int64(len(bodyBytes)),
		ContentType:   resp.Header.Get("Content-Type"),
		ExecutionTime: time.Now(),
	}, nil
}
