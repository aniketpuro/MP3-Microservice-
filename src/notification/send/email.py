import smtplib
import os
import json

from email.message import EmailMessage


def notify(message):
    try:
        print(f"Processing message: {message}")
        message = json.loads(message)
        mp3_fid = message.get("mp3_fid")
        sender_address = os.environ.get("EMAIL_USER")
        sender_pass = os.environ.get("EMAIL_PASS")
        recipient_address = message.get("username")
        
        print(f"Sender: {sender_address}, Recipient: {recipient_address}, FID: {mp3_fid}")

        if not sender_address or not sender_pass:
            print("Error: EMAIL_USER or EMAIL_PASS environment variables are not set")
            return "Configuration error"

        # Creating message
        msg = EmailMessage()
        msg.set_content(
            f"Your MP3 file is ready for download.\nMP3 file_id: {mp3_fid}")
        msg["Subject"] = "MP3 Conversion Complete"
        msg["From"] = sender_address
        msg["To"] = recipient_address

        print("Attempting to send email via SMTP...")
        session = smtplib.SMTP("smtp.gmail.com", 587)
        session.starttls()
        session.login(sender_address, sender_pass)
        session.send_message(msg, sender_address, recipient_address)
        session.quit()
        print("Email sent successfully")

    except Exception as e:
        print(f"Exception in notify: {e}")
        import traceback
        traceback.print_exc()
        return e
