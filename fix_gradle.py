import re

with open('app/build.gradle', 'r') as f:
    content = f.read()

# Add release signing config after debug
content = re.sub(
    r'(    signingConfigs \{\s+debug \{[^}]+\}\s+)(\})',
    r'\1        release {\n            storeFile file(\'release.keystore\')\n            storePassword \'android\'\n            keyAlias \'release\'\n            keyPassword \'android\'\n        }\n\2',
    content,
    flags=re.MULTILINE | re.DOTALL
)

# Change release buildType to use release signing
content = re.sub(
    r'(release \{[^}]*?)signingConfig signingConfigs\.debug',
    r'\1signingConfig signingConfigs.release',
    content,
    flags=re.MULTILINE | re.DOTALL
)

with open('app/build.gradle', 'w') as f:
    f.write(content)
print('Updated build.gradle successfully') 