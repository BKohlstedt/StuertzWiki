$pgUser = "postgres"
$pgPassword = "123"
$authDb = "auth_db"
$contentDb = "content_db"
$tempSQLFile = "$env:TEMP\init_stuertz.sql"

$psqlExists = Get-Command psql -ErrorAction SilentlyContinue

if (-not $psqlExists) {
    Write-Error "'psql' nicht gefunden."
    exit 1
}

$createSQL = @"
DROP DATABASE IF EXISTS $authDb;
DROP DATABASE IF EXISTS $contentDb;

CREATE DATABASE $authDb;
CREATE DATABASE $contentDb;

\c $authDb;

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE role_permissions (
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INT REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name) VALUES ('admin'), ('superuser'), ('user');

INSERT INTO permissions (key, description) VALUES
('manage_users', 'Benutzer verwalten'),
('invite_users', 'Benutzer einladen'),
('edit_content', 'Inhalte bearbeiten'),
('access_wiki', 'Zugriff aufs Wiki');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON
    (r.name = 'admin') OR
    (r.name = 'superuser' AND p.key IN ('edit_content', 'access_wiki')) OR
    (r.name = 'user' AND p.key = 'access_wiki');

INSERT INTO users (email, password_hash, role_id)
SELECT
    val.email,
    '\$2b\$10\$aRp1/ivbZb9s4B5Mubz5O.2GoUY2YFzh4H0BMyiOGMzfgtxMiyI3S',
    r.id
FROM (VALUES
    ('admin@stuertz.de', 'admin'),
    ('superuser@stuertz.de', 'superuser'),
    ('user@stuertz.de', 'user')
) AS val(email, role_name)
JOIN roles r ON r.name = val.role_name;

\c $contentDb;

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    department_id INT REFERENCES departments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attachments (
    id SERIAL PRIMARY KEY,
    page_id INT REFERENCES pages(id) ON DELETE CASCADE,
    file_url TEXT
);

CREATE TABLE change_logs (
    id SERIAL PRIMARY KEY,
    page_id INT REFERENCES pages(id) ON DELETE CASCADE,
    changed_by INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changes TEXT
);

INSERT INTO departments (name) VALUES
('Vertrieb'), ('PM'), ('EKon'), ('MKon'), ('SKon'),
('Controlling'), ('Fertigungsleitung'), ('Halle5'), ('Halle 7'),
('Empore'), ('Service'), ('FieldService'), ('Smi'), ('Stuga'),
('Spl'), ('Smc');
"@

$createSQL | Out-File -FilePath $tempSQLFile -Encoding UTF8

$env:PGPASSWORD = $pgPassword

try {
    psql -U $pgUser -f $tempSQLFile 2>&1 | ForEach-Object { Write-Host $_ }
} catch {
    Write-Error "Fehler: $_"
}
