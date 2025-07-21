# EmailJS Setup Instructions

Het contactformulier is nu klaar om te werken met EmailJS. Volg deze stappen om het te activeren:

## Stap 1: Maak een EmailJS account

1. Ga naar https://www.emailjs.com
2. Klik op "Sign Up Free" 
3. Maak een account aan (gratis)

## Stap 2: Configureer je email service

1. Na inloggen, ga naar "Email Services" in het dashboard
2. Klik op "Add New Service"
3. Kies je email provider (bijvoorbeeld Gmail, Outlook, etc.)
4. Volg de instructies om je email te verbinden
5. Noteer je **Service ID** (bijvoorbeeld: "service_abc123")

## Stap 3: Maak een email template

1. Ga naar "Email Templates" 
2. Klik op "Create New Template"
3. Gebruik deze template configuratie:

**To Email:** arthur.agw@gmail.com

**Subject:** Nieuw contactformulier bericht - {{subject}}

**Content:**
```
Nieuw bericht via het contactformulier:

Naam: {{name}}
E-mail: {{email}}
Telefoon: {{phone}}
Onderwerp: {{subject}}

Bericht:
{{message}}

---
Dit bericht is verstuurd via het contactformulier op weijdenmulticare.nl
```

4. Sla de template op
5. Noteer je **Template ID** (bijvoorbeeld: "template_xyz789")

## Stap 4: Verkrijg je Public Key

1. Ga naar "Account" → "API Keys"
2. Kopieer je **Public Key**

## Stap 5: Update de code

Open het bestand `js/main.js` en vervang de placeholders op regel 13-15:

```javascript
this.emailJSConfig = {
  publicKey: 'YOUR_PUBLIC_KEY',    // Vervang met je EmailJS public key
  serviceId: 'YOUR_SERVICE_ID',     // Vervang met je EmailJS service ID
  templateId: 'YOUR_TEMPLATE_ID'    // Vervang met je EmailJS template ID
};
```

Bijvoorbeeld:
```javascript
this.emailJSConfig = {
  publicKey: 'BX7K9mPl2vN8dF3Qx',
  serviceId: 'service_abc123',
  templateId: 'template_xyz789'
};
```

## Klaar!

Het contactformulier werkt nu. Test het door:
1. Het formulier in te vullen op de contact pagina
2. Op "Bericht versturen" te klikken
3. Je zou een email moeten ontvangen op arthur.agw@gmail.com

## Gratis limiet

EmailJS gratis plan bevat:
- 200 emails per maand
- 2 email templates
- Geen kredietkaart vereist

Dit is ruim voldoende voor een zakelijke website contactformulier.