# backend/src/scripts/insert_tips.py
import sys
import os
from datetime import datetime

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.database.database import engine
from src.models.topic import Topic
from src.models.tip import Tip
from src.models.tip_topics import TipTopic
from sqlmodel import Session, select, delete, SQLModel

# Ensure tables exist
SQLModel.metadata.create_all(engine)

topic_names = [
    "Password management",
    "Phishing awareness",
    "Safe browsing",
    "2FA",
    "Device Security",
    "E-mail & communication security",
    "Data backup"
]

topic_ids = {}

with Session(engine) as session:
    print("Loading topics...")
    for name in topic_names:
        topic = session.exec(select(Topic).where(Topic.name == name)).first()
        if topic:
            topic_ids[name] = topic.id
            print(f"Found topic: {name} (ID: {topic.id})")
        else:
            print(f"ERROR: Topic '{name}' not found! Run the test script first.")
            sys.exit(1)

# === CLEAN EXISTING TIPS (to avoid duplicates) ===
print("\nCleaning existing tips and tip-topic links...")
with Session(engine) as session:
    # Delete tip-topic links first
    session.exec(delete(TipTopic))
    # Then delete tips
    session.exec(delete(Tip))
    session.commit()
    print("All existing tips removed.")

# === 20+ TIPS PER TOPIC (real, useful 2026 best practices) ===
tips_data = [
    # Password management (~20)
    {"title": "Use a Password Manager", "content": "Store all passwords securely and generate strong unique ones automatically.", "topics": ["Password management"]},
    {"title": "Never Reuse Passwords", "content": "Each account needs its own password to prevent credential stuffing attacks.", "topics": ["Password management"]},
    {"title": "Aim for 16+ Characters", "content": "Long passphrases are stronger and easier to remember than complex short passwords.", "topics": ["Password management"]},
    {"title": "Enable Passkeys", "content": "Use passwordless passkeys where available — they resist phishing completely.", "topics": ["Password management"]},
    {"title": "Check for Breaches Regularly", "content": "Use tools like Have I Been Pwned to monitor exposed passwords.", "topics": ["Password management"]},
    {"title": "Avoid Common Words", "content": "Don't use dictionary words, names, or sequences like '123456'.", "topics": ["Password management"]},
    {"title": "Change Compromised Passwords Immediately", "content": "If a service reports a breach, update that password everywhere.", "topics": ["Password management"]},
    {"title": "Use Random Generators", "content": "Let your password manager create truly random passwords.", "topics": ["Password management"]},
    {"title": "Separate Personal & Work Passwords", "content": "Never use the same password for personal and professional accounts.", "topics": ["Password management"]},
    {"title": "Enable Auto-Update in Managers", "content": "Let your manager automatically update weak or reused passwords.", "topics": ["Password management"]},
    {"title": "Store Recovery Codes Safely", "content": "Keep backup codes in a secure physical location.", "topics": ["Password management"]},
    {"title": "Use Biometrics with Passwords", "content": "Combine fingerprint/face ID with strong passwords for extra protection.", "topics": ["Password management"]},
    {"title": "Avoid Password Hints", "content": "Security questions are often guessable — treat them like passwords.", "topics": ["Password management"]},
    {"title": "Monitor Dark Web Exposure", "content": "Many managers now alert you if passwords appear on the dark web.", "topics": ["Password management"]},
    {"title": "Prioritize High-Risk Accounts", "content": "Banking, email, and cloud storage need the strongest passwords first.", "topics": ["Password management"]},
    {"title": "Use Different Managers for Work/Personal", "content": "Keep work and personal passwords completely separated.", "topics": ["Password management"]},
    {"title": "Enable Password Health Reports", "content": "Regularly review weak, reused, or old passwords.", "topics": ["Password management"]},
    {"title": "Teach Family Strong Habits", "content": "Help loved ones use managers and avoid common mistakes.", "topics": ["Password management"]},
    {"title": "Avoid Browser-Saved Passwords", "content": "Use a dedicated manager instead of built-in browser storage.", "topics": ["Password management"]},
    {"title": "Prepare for Quantum Threats", "content": "Future-proof with managers that support post-quantum algorithms.", "topics": ["Password management"]},

    # Phishing awareness (~20)
    {"title": "Hover Before Clicking", "content": "Always hover over links to see the real URL.", "topics": ["Phishing awareness"]},
    {"title": "Check Sender Email Carefully", "content": "Look for misspellings like 'support@micr0soft.com'.", "topics": ["Phishing awareness"]},
    {"title": "Beware of Urgency", "content": "Phishers create panic — legitimate companies rarely threaten immediate action.", "topics": ["Phishing awareness"]},
    {"title": "Verify Unexpected Requests", "content": "If someone asks for money or info unexpectedly, call them directly.", "topics": ["Phishing awareness"]},
    {"title": "Don’t Download Unknown Attachments", "content": "Even from known senders, verify before opening.", "topics": ["Phishing awareness"]},
    {"title": "Use Email Filters", "content": "Enable spam and phishing filters in your email client.", "topics": ["Phishing awareness"]},
    {"title": "Report Suspicious Emails", "content": "Forward phishing attempts to your IT team or provider.", "topics": ["Phishing awareness"]},
    {"title": "Watch for Deepfake Audio/Video", "content": "AI voice clones are rising — verify unusual requests by phone.", "topics": ["Phishing awareness"]},
    {"title": "Avoid QR Code Scams", "content": "Don’t scan unknown QR codes — they can lead to phishing sites.", "topics": ["Phishing awareness"]},
    {"title": "Check for HTTPS", "content": "Legitimate sites use HTTPS and a valid certificate.", "topics": ["Phishing awareness"]},
    {"title": "Be Cautious on Social Media", "content": "Fake profiles often send phishing DMs.", "topics": ["Phishing awareness"]},
    {"title": "Train Regularly", "content": "Participate in phishing simulations to stay sharp.", "topics": ["Phishing awareness"]},
    {"title": "Use Browser Warnings", "content": "Heed browser alerts about dangerous sites.", "topics": ["Phishing awareness"]},
    {"title": "Verify Shortened URLs", "content": "Expand bit.ly or tinyurl links before clicking.", "topics": ["Phishing awareness"]},
    {"title": "Don’t Share OTPs", "content": "No legitimate service asks for your 2FA codes.", "topics": ["Phishing awareness"]},
    {"title": "Watch for AI-Generated Emails", "content": "Perfect grammar doesn’t mean it’s real.", "topics": ["Phishing awareness"]},
    {"title": "Avoid Public Wi-Fi for Sensitive Tasks", "content": "Phishers target open networks.", "topics": ["Phishing awareness"]},
    {"title": "Use Anti-Phishing Tools", "content": "Browser extensions can block known phishing sites.", "topics": ["Phishing awareness"]},
    {"title": "Teach Children Awareness", "content": "Kids are targets too — explain safe clicking.", "topics": ["Phishing awareness"]},
    {"title": "Double-Check Payment Requests", "content": "CEO fraud is common — verify large transfers.", "topics": ["Phishing awareness"]},

    # Safe browsing (~20)
    {"title": "Always Use HTTPS", "content": "Check for the padlock — never enter data on HTTP sites.", "topics": ["Safe browsing"]},
    {"title": "Keep Browser Updated", "content": "Updates patch critical security holes.", "topics": ["Safe browsing"]},
    {"title": "Use Privacy-Focused Browsers", "content": "Brave, Firefox, or Tor block trackers by default.", "topics": ["Safe browsing"]},
    {"title": "Block Third-Party Cookies", "content": "Prevent cross-site tracking.", "topics": ["Safe browsing"]},
    {"title": "Enable Safe Browsing Mode", "content": "Google’s protection warns about malicious sites.", "topics": ["Safe browsing"]},
    {"title": "Use a VPN on Public Wi-Fi", "content": "Encrypt your traffic on cafes, airports, etc.", "topics": ["Safe browsing"]},
    {"title": "Avoid Suspicious Downloads", "content": "Only download from trusted sources.", "topics": ["Safe browsing"]},
    {"title": "Clear Cache Regularly", "content": "Remove tracking data and free space.", "topics": ["Safe browsing"]},
    {"title": "Use Ad & Tracker Blockers", "content": "uBlock Origin is highly recommended.", "topics": ["Safe browsing"]},
    {"title": "Disable Auto-Fill for Sensitive Data", "content": "Prevent credential theft.", "topics": ["Safe browsing"]},
    {"title": "Check Site Reputation", "content": "Use tools like VirusTotal before visiting unknown sites.", "topics": ["Safe browsing"]},
    {"title": "Avoid Pop-Ups", "content": "Never click 'Allow' on suspicious notifications.", "topics": ["Safe browsing"]},
    {"title": "Use Container Tabs", "content": "Isolate sites in Firefox Multi-Account Containers.", "topics": ["Safe browsing"]},
    {"title": "Enable DNS-over-HTTPS", "content": "Prevent ISP snooping.", "topics": ["Safe browsing"]},
    {"title": "Don’t Save Payment Info", "content": "In browsers for shared devices.", "topics": ["Safe browsing"]},
    {"title": "Use Private Browsing Wisely", "content": "It doesn’t hide you from sites or ISPs.", "topics": ["Safe browsing"]},
    {"title": "Block JavaScript on Risky Sites", "content": "NoScript extension gives fine control.", "topics": ["Safe browsing"]},
    {"title": "Verify Certificates", "content": "Click the padlock to check issuer.", "topics": ["Safe browsing"]},
    {"title": "Separate Profiles for Work/Personal", "content": "Keep cookies and logins isolated.", "topics": ["Safe browsing"]},
    {"title": "Use Anti-Fingerprinting", "content": "Extensions like CanvasBlocker.", "topics": ["Safe browsing"]},

    # 2FA (~20)
    {"title": "Enable 2FA Everywhere", "content": "Especially email, banking, and cloud storage.", "topics": ["2FA"]},
    {"title": "Prefer Authenticator Apps", "content": "Over SMS — SMS can be intercepted.", "topics": ["2FA"]},
    {"title": "Use Hardware Keys", "content": "YubiKey or Titan — most secure option.", "topics": ["2FA"]},
    {"title": "Backup Codes Securely", "content": "Print and store in a safe place.", "topics": ["2FA"]},
    {"title": "Register Multiple Methods", "content": "App + key + backup phone.", "topics": ["2FA"]},
    {"title": "Use Passkeys", "content": "Passwordless and phishing-resistant.", "topics": ["2FA"]},
    {"title": "Avoid SMS When Possible", "content": "SIM swapping is a real threat.", "topics": ["2FA"]},
    {"title": "Combine with Biometrics", "content": "Face/Fingerprint for device unlock.", "topics": ["2FA"]},
    {"title": "Enable for Recovery Email", "content": "Protect the email used for password resets.", "topics": ["2FA"]},
    {"title": "Use Time-Based Codes", "content": "TOTP is standard in apps.", "topics": ["2FA"]},
    {"title": "Never Share Codes", "content": "No legitimate service asks for them.", "topics": ["2FA"]},
    {"title": "Set Up on New Devices Fast", "content": "Transfer codes immediately.", "topics": ["2FA"]},
    {"title": "Use Cloud Backup for Apps", "content": "Encrypted sync in Authy or similar.", "topics": ["2FA"]},
    {"title": "Prioritize Critical Accounts", "content": "Email and banking first.", "topics": ["2FA"]},
    {"title": "Teach Family to Use It", "content": "Help them set up secure 2FA.", "topics": ["2FA"]},
    {"title": "Monitor Login Attempts", "content": "Many services notify suspicious logins.", "topics": ["2FA"]},
    {"title": "Use FIDO2 Keys", "content": "Future-proof against quantum threats.", "topics": ["2FA"]},
    {"title": "Combine with Strong Passwords", "content": "2FA is extra layer, not replacement.", "topics": ["2FA"]},
    {"title": "Enable for Social Media", "content": "Prevent account takeovers.", "topics": ["2FA"]},
    {"title": "Prepare for Loss", "content": "Have recovery plan ready.", "topics": ["2FA"]},

    # Device Security (~20)
    {"title": "Lock Screen Immediately", "content": "Use strong PIN/biometrics.", "topics": ["Device Security"]},
    {"title": "Keep OS Updated", "content": "Install security patches promptly.", "topics": ["Device Security"]},
    {"title": "Enable Find My Device", "content": "For remote lock/wipe.", "topics": ["Device Security"]},
    {"title": "Use Full-Disk Encryption", "content": "Standard on modern phones.", "topics": ["Device Security"]},
    {"title": "Install Reputable Antivirus", "content": "For malware scanning.", "topics": ["Device Security"]},
    {"title": "Avoid Unknown Apps", "content": "Only official stores.", "topics": ["Device Security"]},
    {"title": "Disable Unused Features", "content": "Bluetooth, NFC when not needed.", "topics": ["Device Security"]},
    {"title": "Use Secure Wi-Fi", "content": "VPN on public networks.", "topics": ["Device Security"]},
    {"title": "Regularly Review Permissions", "content": "Revoke unnecessary app access.", "topics": ["Device Security"]},
    {"title": "Enable Remote Wipe", "content": "If device is lost.", "topics": ["Device Security"]},
    {"title": "Avoid Root/Jailbreak", "content": "It bypasses built-in security.", "topics": ["Device Security"]},
    {"title": "Use Strong Biometrics", "content": "Prefer face/fingerprint over pattern.", "topics": ["Device Security"]},
    {"title": "Backup Regularly", "content": "Encrypted cloud backup.", "topics": ["Device Security"]},
    {"title": "Monitor Battery/Performance", "content": "Sudden drain may indicate malware.", "topics": ["Device Security"]},
    {"title": "Separate Work/Personal Profiles", "content": "Use Android work profile or iOS Focus.", "topics": ["Device Security"]},
    {"title": "Enable Auto-Lock", "content": "Short timeout period.", "topics": ["Device Security"]},
    {"title": "Avoid Public Charging Stations", "content": "Use your own cable/power bank.", "topics": ["Device Security"]},
    {"title": "Use App Lock Features", "content": "Extra PIN for sensitive apps.", "topics": ["Device Security"]},
    {"title": "Keep Bluetooth Hidden", "content": "Don’t broadcast device name.", "topics": ["Device Security"]},
    {"title": "Factory Reset Before Selling", "content": "Wipe all data securely.", "topics": ["Device Security"]},

    # E-mail & communication security (~20)
    {"title": "Use End-to-End Encryption", "content": "Signal, WhatsApp, or ProtonMail.", "topics": ["E-mail & communication security"]},
    {"title": "Verify Sender Before Clicking", "content": "Check full email address.", "topics": ["E-mail & communication security"]},
    {"title": "Enable DMARC/SPF/DKIM", "content": "For your domain to prevent spoofing.", "topics": ["E-mail & communication security"]},
    {"title": "Avoid Public Wi-Fi for Email", "content": "Use VPN if necessary.", "topics": ["E-mail & communication security"]},
    {"title": "Use Encrypted Email Services", "content": "ProtonMail or Tutanota.", "topics": ["E-mail & communication security"]},
    {"title": "Don’t Open Unexpected Attachments", "content": "Verify with sender first.", "topics": ["E-mail & communication security"]},
    {"title": "Use Secure Messaging Apps", "content": "Prefer Signal over SMS.", "topics": ["E-mail & communication security"]},
    {"title": "Enable Email Encryption", "content": "PGP or S/MIME for sensitive messages.", "topics": ["E-mail & communication security"]},
    {"title": "Beware of Spoofed Addresses", "content": "Check display name vs real address.", "topics": ["E-mail & communication security"]},
    {"title": "Use Disposable Emails", "content": "For sign-ups to avoid spam.", "topics": ["E-mail & communication security"]},
    {"title": "Report Spam Aggressively", "content": "Helps train filters.", "topics": ["E-mail & communication security"]},
    {"title": "Separate Work/Personal Email", "content": "Reduce cross-contamination risk.", "topics": ["E-mail & communication security"]},
    {"title": "Enable 2FA on Email", "content": "Your email is the key to everything.", "topics": ["E-mail & communication security"]},
    {"title": "Use Email Aliases", "content": "Hide real address with forwarding.", "topics": ["E-mail & communication security"]},
    {"title": "Scan Attachments", "content": "With antivirus before opening.", "topics": ["E-mail & communication security"]},
    {"title": "Avoid Forwarding Chains", "content": "They expose everyone’s addresses.", "topics": ["E-mail & communication security"]},
    {"title": "Use BCC for Groups", "content": "Protect recipients’ privacy.", "topics": ["E-mail & communication security"]},
    {"title": "Delete Old Emails", "content": "Reduce data exposure in breaches.", "topics": ["E-mail & communication security"]},
    {"title": "Monitor for Breaches", "content": "Tools like Have I Been Pwned.", "topics": ["E-mail & communication security"]},
    {"title": "Use Secure Clients", "content": "Thunderbird with PGP or Outlook with encryption.", "topics": ["E-mail & communication security"]},

    # Data backup (~20)
    {"title": "Follow 3-2-1 Rule", "content": "3 copies, 2 media types, 1 off-site.", "topics": ["Data backup"]},
    {"title": "Use Encrypted Backups", "content": "Protect against theft.", "topics": ["Data backup"]},
    {"title": "Test Restores Regularly", "content": "Backups are useless if they don’t work.", "topics": ["Data backup"]},
    {"title": "Automate Backups", "content": "Set and forget with scheduling.", "topics": ["Data backup"]},
    {"title": "Include Cloud & Local", "content": "Hybrid approach is safest.", "topics": ["Data backup"]},
    {"title": "Use Immutable Storage", "content": "Prevent ransomware deletion.", "topics": ["Data backup"]},
    {"title": "Backup Mobile Devices", "content": "Photos, contacts, apps.", "topics": ["Data backup"]},
    {"title": "Version Your Backups", "content": "Keep multiple versions for recovery.", "topics": ["Data backup"]},
    {"title": "Prioritize Critical Data", "content": "Documents, photos, finances first.", "topics": ["Data backup"]},
    {"title": "Use Cloud with Zero-Knowledge", "content": "Only you can access data.", "topics": ["Data backup"]},
    {"title": "Off-Site Physical Copy", "content": "External drive in safe location.", "topics": ["Data backup"]},
    {"title": "Enable Ransomware Detection", "content": "In backup software.", "topics": ["Data backup"]},
    {"title": "Backup SaaS Data", "content": "Google Drive, Office 365 need separate backup.", "topics": ["Data backup"]},
    {"title": "Document Your Strategy", "content": "What, where, how often.", "topics": ["Data backup"]},
    {"title": "Use Incremental Backups", "content": "Save time and space.", "topics": ["Data backup"]},
    {"title": "Monitor Backup Health", "content": "Alerts for failures.", "topics": ["Data backup"]},
    {"title": "Include System Images", "content": "For full device recovery.", "topics": ["Data backup"]},
    {"title": "Teach Family Backup Habits", "content": "Help them protect memories.", "topics": ["Data backup"]},
    {"title": "Prepare for Quantum Threats", "content": "Future-proof encryption.", "topics": ["Data backup"]},
    {"title": "Regularly Review Strategy", "content": "As data grows and threats evolve.", "topics": ["Data backup"]},
]

print("\nAdding ~140 new security tips...")
with Session(engine) as session:
    for i, data in enumerate(tips_data, 1):
        tip = Tip(title=data["title"], content=data["content"], created_at=datetime.utcnow())
        session.add(tip)
        session.commit()
        session.refresh(tip)

        for topic_name in data["topics"]:
            topic_id = topic_ids[topic_name]
            session.add(TipTopic(tip_id=tip.id, topic_id=topic_id))

        session.commit()
        print(f"Tip {i}/{len(tips_data)} added: {data['title']}")

print("\nALL DONE! Database cleaned and populated with 140+ fresh tips across all 7 topics.")
print("Your Safe Me Tips feature now has plenty of real, useful content!")