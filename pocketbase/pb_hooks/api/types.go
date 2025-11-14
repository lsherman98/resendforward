package api

type EmailReceivedWebhook struct {
	Type      string `json:"type"`
	CreatedAt string `json:"created_at"`
	Data      struct {
		EmailID     string   `json:"email_id"`
		CreatedAt   string   `json:"created_at"`
		From        string   `json:"from"`
		To          []string `json:"to"`
		Bcc         []string `json:"bcc"`
		Cc          []string `json:"cc"`
		Subject     string   `json:"subject"`
		MessageID   string   `json:"message_id"`
		Attachments []struct {
			ID                 string `json:"id"`
			Filename           string `json:"filename"`
			ContentType        string `json:"content_type"`
			ContentDisposition string `json:"content_disposition"`
			ContentID          string `json:"content_id"`
		} `json:"attachments"`
	} `json:"data"`
}

type EmailSentWebhook struct {
	Type      string `json:"type"`
	CreatedAt string `json:"created_at"`
	Data      struct {
		EmailID   string   `json:"email_id"`
		CreatedAt string   `json:"created_at"`
		From      string   `json:"from"`
		To        []string `json:"to"`
		Subject   string   `json:"subject"`
		Headers   []struct {
			Name  string `json:"name"`
			Value string `json:"value"`
		} `json:"headers"`
	} `json:"data"`
}

type EmailDeliveredWebhook struct {
	Type      string `json:"type"`
	CreatedAt string `json:"created_at"`
	Data      struct {
		EmailID   string   `json:"email_id"`
		CreatedAt string   `json:"created_at"`
		From      string   `json:"from"`
		To        []string `json:"to"`
		Subject   string   `json:"subject"`
		Headers   []struct {
			Name  string `json:"name"`
			Value string `json:"value"`
		} `json:"headers"`
	} `json:"data"`
}

type EmailFailedWebhook struct {
	Type      string `json:"type"`
	CreatedAt string `json:"created_at"`
	Data      struct {
		BroadcastID string   `json:"broadcast_id,omitempty"`
		EmailID     string   `json:"email_id"`
		CreatedAt   string   `json:"created_at"`
		From        string   `json:"from"`
		To          []string `json:"to"`
		Subject     string   `json:"subject"`
		TemplateID  string   `json:"template_id,omitempty"`
		Failed      struct {
			Reason string `json:"reason"`
		} `json:"failed"`
		Tags map[string]string `json:"tags,omitempty"`
	} `json:"data"`
}
