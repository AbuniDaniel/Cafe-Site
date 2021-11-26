CREATE DATABASE db_test ENCODING 'UTF-8' LC_COLLATE 'ro-RO-x-icu' LC_CTYPE 'ro_RO' TEMPLATE template0;

CREATE USER 'daniel' WITH ENCRYPTED PASSWORD 'daniel';
GRANT ALL PRIVILEGES ON DATABASE db_test TO daniel ;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO daniel;

CREATE TYPE lapte AS ENUM('cocos', 'soia', 'migdale', 'fara lapte');
CREATE TYPE tip_produse AS ENUM('cafea decofeinizata', 'cafea cofeinizata', 'gustari');

CREATE TABLE IF NOT EXISTS cafele(
    id serial PRIMARY KEY,
    nume VARCHAR(50) UNIQUE NOT NULL,
    descriere TEXT,
    pret FLOAT NOT NULL,
    tip_lapte lapte DEFAULT 'fara lapte',
    tip_produs tip_produse NOT NULL,
    calorii INT NOT NULL CHECK (calorii>=0),
    ingrediente VARCHAR [],
    reducere BOOLEAN NOT NULL DEFAULT FALSE,
    imagine VARCHAR(300),
    data_adaugare TIMESTAMP DEFAULT current_timestamp
    );

INSERT into cafele (nume, descriere, pret, tip_produs, tip_lapte, calorii, ingrediente, reducere, imagine) VALUES
('affogato', 'O cafea delicioasa', 12, 'cafea cofeinizata', 'cocos', 23, '{"cofeina", "potasiu", "sodiu"}', False, 'affogato.png'),
('black-coffee', 'O cafea perfecta', 13, 'cafea cofeinizata', 'soia', 19, '{"cofeina", "proteine"}', False, 'black-coffee.png'),
('cafe-au-lait', 'O cafea destul de buna', 12, 'cafea cofeinizata', 'migdale', 19, '{"cofeina", "proteine"}', False, 'cafe-au-lait.png'),
('cappuccino', 'O cafea destul buna', 13, 'cafea decofeinizata', 'fara lapte', 17, '{"potasiu"}', True, 'cappuccino.png'),
('flat-white', 'O cafea apreciata', 15,'cafea cofeinizata', 'cocos', 12, '{"cofeina", "proteine"}', False, 'flat-white.png'),
('freddo', 'O cafea destul buna', 13,'cafea decofeinizata', 'migdale', 21, '{"proteine"}', True, 'freddo.png');