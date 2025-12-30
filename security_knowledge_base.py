import sys

class SecurityKnowledgeBase:
    def __init__(self):
        self.knowledge = {
            "Network Scanning": {
                "Nmap": {
                    "Description": "Nmap (Network Mapper) is used to discover hosts and services on a computer network by sending packets and analyzing the responses.",
                    "Defense": "Configure firewalls to block unsolicited scans. Use Intrusion Detection Systems (IDS) like Snort to detect scan patterns. Disable unnecessary services."
                },
                "Wireshark": {
                    "Description": "Wireshark is a network protocol analyzer that lets you see what's happening on your network at a microscopic level.",
                    "Defense": "Use encryption (TLS/SSL) for all sensitive traffic so that captured packets cannot be read. Monitor network for unauthorized promiscuous mode interfaces."
                }
            },
            "Web Application Security": {
                "SQL Injection": {
                    "Description": "An attack technique used to exploit applications that construct SQL statements from user input without sanitization.",
                    "Defense": "Use prepared statements (parameterized queries). Validate and sanitize all user inputs. Principle of Least Privilege for database accounts."
                },
                "XSS (Cross-Site Scripting)": {
                    "Description": "Injecting malicious scripts into trusted websites.",
                    "Defense": "Content Security Policy (CSP). Context-sensitive output encoding. Input validation."
                }
            },
            "Password Security": {
                "Brute Force": {
                    "Description": "Attempting to guess a password by trying every possible combination.",
                    "Defense": "Implement account lockouts after failed attempts. Use rate limiting. Enforce strong password complexity. Use Multi-Factor Authentication (MFA)."
                },
                "Hash Cracking": {
                    "Description": "Attempting to recover a plaintext password from its hash.",
                    "Defense": "Use strong, slow hashing algorithms (Argon2, bcrypt, scrypt). Salt passwords before hashing to prevent rainbow table attacks."
                }
            }
        }

    def display_categories(self):
        print("\n--- Security Knowledge Base ---")
        print("Select a category to learn more:")
        for i, category in enumerate(self.knowledge.keys(), 1):
            print(f"{i}. {category}")
        print("0. Exit")

    def display_tools(self, category):
        print(f"\n--- {category} ---")
        tools = list(self.knowledge[category].keys())
        for i, tool in enumerate(tools, 1):
            print(f"{i}. {tool}")
        print("0. Back")
        return tools

    def display_info(self, category, tool_name):
        info = self.knowledge[category][tool_name]
        print(f"\nTool/Concept: {tool_name}")
        print(f"Description: {info['Description']}")
        print(f"Defensive Strategy: {info['Defense']}")

    def run(self):
        while True:
            self.display_categories()
            choice = input("\nEnter your choice: ")

            if choice == '0':
                print("Exiting...")
                break

            try:
                cat_index = int(choice) - 1
                categories = list(self.knowledge.keys())

                if 0 <= cat_index < len(categories):
                    selected_category = categories[cat_index]
                    while True:
                        tools = self.display_tools(selected_category)
                        tool_choice = input("\nEnter your choice: ")

                        if tool_choice == '0':
                            break

                        try:
                            tool_index = int(tool_choice) - 1
                            if 0 <= tool_index < len(tools):
                                self.display_info(selected_category, tools[tool_index])
                                input("\nPress Enter to continue...")
                            else:
                                print("Invalid selection.")
                        except ValueError:
                            print("Please enter a number.")
                else:
                    print("Invalid selection.")
            except ValueError:
                print("Please enter a number.")

if __name__ == "__main__":
    app = SecurityKnowledgeBase()
    app.run()
