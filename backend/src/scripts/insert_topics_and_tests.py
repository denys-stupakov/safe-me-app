# backend/src/scripts/insert_topics_and_tests.py
import sys
import os
from datetime import datetime

# Add project root to path so imports work
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.database.database import engine
from sqlmodel import Session, select, SQLModel

# Import all models to register relationships (this fixes the mapper error)
from src.models.topic import Topic
from src.models.test import Test
from src.models.test_answer import TestAnswer
from src.models.test_topics import TestTopic

# Create tables
SQLModel.metadata.create_all(engine)

# === INSERT TOPICS ===
topics = [
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
    print("Adding topics...")
    for name in topics:
        existing = session.exec(select(Topic).where(Topic.name == name)).first()
        if existing:
            topic_ids[name] = existing.id
            print(f"Topic already exists: {name} (ID: {existing.id})")
        else:
            topic = Topic(name=name, created_at=datetime.utcnow())
            session.add(topic)
            session.commit()
            session.refresh(topic)
            topic_ids[name] = topic.id
            print(f"Added topic: {name} (ID: {topic.id})")

# === FULL 20 TESTS WITH MULTIPLE CORRECT ANSWERS ===
tests_data = [
    # Password management
    {"content": "Which are characteristics of a strong password?", "answers": [("At least 16 characters long", True), ("Includes numbers, symbols, upper and lower case", True), ("Based on personal information", False), ("Unique for each account", True)], "topics": ["Password management"]},
    {"content": "What are best practices for password management?", "answers": [("Use a password manager", True), ("Change passwords if compromised", True), ("Reuse passwords", False), ("Enable 2FA", True)], "topics": ["Password management"]},

    # Phishing awareness
    {"content": "Which are signs of a phishing email?", "answers": [("Urgent language", True), ("Mismatched sender domain", True), ("Spelling errors", True), ("Verified sender", False)], "topics": ["Phishing awareness"]},
    {"content": "How should you respond to phishing?", "answers": [("Report it", True), ("Delete it", True), ("Click links", False), ("Forward to friends", False)], "topics": ["Phishing awareness"]},

    # Safe browsing
    {"content": "What are safe browsing practices?", "answers": [("Use HTTPS", True), ("Update browser", True), ("Click pop-ups", False), ("Avoid public WiFi for banking", True)], "topics": ["Safe browsing"]},
    {"content": "How to handle pop-ups?", "answers": [("Close immediately", True), ("Run antivirus", True), ("Enter info", False), ("Share screenshot", False)], "topics": ["Safe browsing"]},

    # 2FA
    {"content": "Benefits of 2FA?", "answers": [("Extra security layer", True), ("Protects if password stolen", True), ("Slower login", False), ("Can use app or key", True)], "topics": ["2FA"]},
    {"content": "Types of 2FA?", "answers": [("SMS", True), ("Authenticator app", True), ("Second password only", False), ("Hardware token", True)], "topics": ["2FA"]},

    # Device Security
    {"content": "Best device security practices?", "answers": [("Screen lock", True), ("Antivirus", True), ("Leave unlocked", False), ("Keep updated", True)], "topics": ["Device Security"]},
    {"content": "If device lost?", "answers": [("Remote wipe", True), ("Change passwords", True), ("Wait and see", False), ("Report to police", True)], "topics": ["Device Security"]},

    # E-mail & communication security
    {"content": "Secure email practices?", "answers": [("End-to-end encryption", True), ("Verify sender", True), ("Open all attachments", False), ("Avoid public WiFi", True)], "topics": ["E-mail & communication security"]},
    {"content": "Common email threats?", "answers": [("Phishing", True), ("Malware attachments", True), ("Encrypted from known sender", False), ("Spoofed addresses", True)], "topics": ["E-mail & communication security"]},

    # Data backup
    {"content": "Best backup practices?", "answers": [("Regular schedule", True), ("Multiple locations", True), ("Never test restore", False), ("Encrypt backups", True)], "topics": ["Data backup"]},
    {"content": "Types of backups?", "answers": [("Full", True), ("Incremental", True), ("No backup", False), ("Differential", True)], "topics": ["Data backup"]},

    # Multi-topic tests
    {"content": "Password + 2FA best practices?", "answers": [("Unique passwords", True), ("Enable 2FA", True), ("Share passwords", False), ("Use authenticator apps", True)], "topics": ["Password management", "2FA"]},
    {"content": "Phishing signs in emails?", "answers": [("Unexpected requests", True), ("Poor grammar", True), ("Legitimate logos only", False), ("Suspicious links", True)], "topics": ["Phishing awareness", "E-mail & communication security"]},
    {"content": "Safe browsing on devices?", "answers": [("Use VPN on public WiFi", True), ("Keep OS updated", True), ("Download from unknown sources", False), ("Enable firewall", True)], "topics": ["Safe browsing", "Device Security"]},
    {"content": "Backup for device security?", "answers": [("Cloud + external", True), ("Encrypt backups", True), ("No encryption", False), ("Test recovery", True)], "topics": ["Data backup", "Device Security"]},
    {"content": "2FA + Device security?", "answers": [("Biometric 2FA", True), ("Secure lock screen", True), ("Disable 2FA", False), ("App-based 2FA", True)], "topics": ["2FA", "Device Security"]},
    {"content": "Email security + phishing?", "answers": [("Check domain", True), ("Avoid clicking links", True), ("Reply to suspicious emails", False), ("Use filters", True)], "topics": ["Phishing awareness", "E-mail & communication security"]}
]

print("\nAdding 20 tests...")
with Session(engine) as session:
    for i, data in enumerate(tests_data, 1):
        test = Test(content=data["content"], created_at=datetime.utcnow())
        session.add(test)
        session.commit()
        session.refresh(test)

        for content, correct in data["answers"]:
            session.add(TestAnswer(test_id=test.id, content=content, is_correct=correct))

        for topic_name in data["topics"]:
            topic_id = topic_ids[topic_name]
            session.add(TestTopic(test_id=test.id, topic_id=topic_id))

        session.commit()
        print(f"Test {i}/20 added: {data['content'][:50]}...")

print("\nALL DONE! 7 topics + 20 tests with multiple correct answers added!")
print("Your Safe Me app database is now FULLY ready for the Test screen!")