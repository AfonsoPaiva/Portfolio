package services

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/afonsopaiva/portfolio-api/internal/config"
	"github.com/afonsopaiva/portfolio-api/internal/models"
	"github.com/mailersend/mailersend-go"
)

// EmailService handles email sending via MailerSend
type EmailService struct {
	client           *mailersend.Mailersend
	fromName         string
	fromEmail        string
	toEmail          string
	thankYouDisabled bool
}

// NewEmailService creates a new email service instance using MailerSend
func NewEmailService() *EmailService {
	client := mailersend.NewMailersend(config.AppConfig.MailerSendAPIKey)

	return &EmailService{
		client:    client,
		fromName:  config.AppConfig.MailerSendFromName,
		fromEmail: config.AppConfig.MailerSendFromEmail,
		toEmail:   config.AppConfig.MailerSendToEmail,
	}
}

// SendContactNotification sends an email notification for a new contact message
// and a thank-you email to the sender
func (s *EmailService) SendContactNotification(msg *models.ContactMessage) error {
	if s.fromEmail == "" || s.toEmail == "" {
		return fmt.Errorf("email configuration incomplete: from=%s, to=%s", s.fromEmail, s.toEmail)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// --- 1. Send notification to admin ---
	subject := fmt.Sprintf("New Contact: %s", msg.Name)

	// HTML body (no emojis)
	html := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #111; border: 1px solid #222; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #00ff9d 0%%, #00cc7d 100%%); padding: 24px; }
        .header h1 { margin: 0; color: #000; font-size: 24px; }
        .content { padding: 24px; }
        .field { margin-bottom: 20px; }
        .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 6px; }
        .value { font-size: 16px; color: #fff; background: #1a1a1a; padding: 12px 16px; border-radius: 8px; border-left: 3px solid #00ff9d; }
        .message { white-space: pre-wrap; line-height: 1.6; }
        .footer { padding: 16px 24px; background: #0a0a0a; border-top: 1px solid #222; font-size: 12px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Message Received</h1>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">From</div>
                <div class="value">%s</div>
            </div>
            <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:%s" style="color: #00ff9d;">%s</a></div>
            </div>
            <div class="field">
                <div class="label">Message</div>
                <div class="value message">%s</div>
            </div>
        </div>
        <div class="footer">
            Sent from your Portfolio Contact Form - %s
        </div>
    </div>
</body>
</html>
`, msg.Name, msg.Email, msg.Email, msg.Message, msg.CreatedAt.Format("Jan 02, 2006 at 15:04"))

	// Plain text fallback
	text := fmt.Sprintf(`
New Contact Form Submission
===========================

From: %s
Email: %s

Message:
%s

---
Received: %s
`, msg.Name, msg.Email, msg.Message, msg.CreatedAt.Format("Jan 02, 2006 at 15:04"))

	// Build the admin notification message
	message := s.client.Email.NewMessage()

	message.SetFrom(mailersend.From{
		Name:  s.fromName,
		Email: s.fromEmail,
	})

	message.SetRecipients([]mailersend.Recipient{
		{
			Name:  "Portfolio Admin",
			Email: s.toEmail,
		},
	})

	message.SetReplyTo(mailersend.ReplyTo{
		Name:  msg.Name,
		Email: msg.Email,
	})

	message.SetSubject(subject)
	message.SetHTML(html)
	message.SetText(text)
	message.SetTags([]string{"portfolio", "contact-form"})

	_, err := s.client.Email.Send(ctx, message)
	if err != nil {
		return fmt.Errorf("failed to send email via MailerSend: %v", err)
	}

	// --- 2. Send thank-you email to the sender ---
	if config.AppConfig.MailerSendSendThankYou == "true" {
		if s.thankYouDisabled {
			fmt.Printf("Skipping thank-you email to %s (disabled due to previous MailerSend limit)\n", msg.Email)
		} else {
			err = s.sendThankYouEmail(msg)
			if err != nil {
				// detect MailerSend unique recipients limit and stop further attempts
				if strings.Contains(err.Error(), "MS42225") || strings.Contains(strings.ToLower(err.Error()), "unique recipients") {
					s.thankYouDisabled = true
					fmt.Printf("Disabling thank-you emails due to MailerSend limit: %v\n", err)
				} else {
					fmt.Printf("Warning: failed to send thank-you email to %s: %v\n", msg.Email, err)
				}
			}
		}
	}

	return nil
}

// sendThankYouEmail sends a thank-you email to the person who submitted the contact form
func (s *EmailService) sendThankYouEmail(msg *models.ContactMessage) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	subject := "Thank you for reaching out!"

	html := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #111; border: 1px solid #222; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #00ff9d 0%%, #00cc7d 100%%); padding: 24px; }
        .header h1 { margin: 0; color: #000; font-size: 24px; }
        .content { padding: 24px; line-height: 1.8; }
        .content p { margin: 0 0 16px 0; color: #ccc; }
        .highlight { color: #00ff9d; }
        .footer { padding: 16px 24px; background: #0a0a0a; border-top: 1px solid #222; font-size: 12px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thank You for Your Message</h1>
        </div>
        <div class="content">
            <p>Hi <span class="highlight">%s</span>,</p>
            <p>Thank you for reaching out! I have received your message and appreciate you taking the time to contact me.</p>
            <p>I will review your message and get back to you as soon as possible, typically within 1-2 business days.</p>
            <p>In the meantime, feel free to check out my portfolio or connect with me on LinkedIn.</p>
            <p>Best regards,<br><span class="highlight">Afonso Paiva</span></p>
        </div>
        <div class="footer">
            This is an automated response - Please do not reply directly to this email
        </div>
    </div>
</body>
</html>
`, msg.Name)

	text := fmt.Sprintf(`
Hi %s,

Thank you for reaching out! I have received your message and appreciate you taking the time to contact me.

I will review your message and get back to you as soon as possible, typically within 1-2 business days.

Best regards,
Afonso Paiva

---
This is an automated response - Please do not reply directly to this email
`, msg.Name)

	message := s.client.Email.NewMessage()

	message.SetFrom(mailersend.From{
		Name:  s.fromName,
		Email: s.fromEmail,
	})

	message.SetRecipients([]mailersend.Recipient{
		{
			Name:  msg.Name,
			Email: msg.Email,
		},
	})

	message.SetSubject(subject)
	message.SetHTML(html)
	message.SetText(text)
	message.SetTags([]string{"portfolio", "thank-you"})

	_, err := s.client.Email.Send(ctx, message)
	if err != nil {
		return fmt.Errorf("failed to send thank-you email: %v", err)
	}

	return nil
}

// SendTestEmail sends a test email to verify configuration
func (s *EmailService) SendTestEmail() error {
	if s.fromEmail == "" || s.toEmail == "" {
		return fmt.Errorf("email configuration incomplete")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	message := s.client.Email.NewMessage()

	message.SetFrom(mailersend.From{
		Name:  s.fromName,
		Email: s.fromEmail,
	})

	message.SetRecipients([]mailersend.Recipient{
		{
			Name:  "Test Recipient",
			Email: s.toEmail,
		},
	})

	message.SetSubject("Portfolio API - Email Test")
	message.SetText("This is a test email from your Portfolio API. MailerSend configuration is working correctly!")
	message.SetHTML("<p>This is a test email from your Portfolio API. <strong>MailerSend configuration is working correctly!</strong></p>")

	_, err := s.client.Email.Send(ctx, message)
	if err != nil {
		return fmt.Errorf("failed to send test email: %v", err)
	}

	return nil
}
