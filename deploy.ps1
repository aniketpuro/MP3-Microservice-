echo "--- Creating infrastructure (terraform apply) ---"
terraform -chdir=terraform apply -auto-approve

echo "--- Cooldown 10 seconds ---"
Start-Sleep -Seconds 10

echo "--- Cluster initialization (ansible-playbook) ---"
wsl -d Ubuntu-24.04 -u root -e bash -c "ANSIBLE_HOST_KEY_CHECKING=False /home/aniket/.local/bin/ansible-playbook -i inventory.ini --private-key keys/accesskey playbooks/main.yaml"