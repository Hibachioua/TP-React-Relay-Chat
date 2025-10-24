CREATE TABLE users (
   user_id serial PRIMARY KEY,
   username VARCHAR ( 50 ) UNIQUE NOT NULL,
   password VARCHAR ( 100 ) NOT NULL,
   email VARCHAR ( 255 ) UNIQUE NOT NULL,
   created_on TIMESTAMP NOT NULL,
   last_login TIMESTAMP,
   external_id VARCHAR ( 50 ) UNIQUE NOT NULL
);

CREATE TABLE rooms (
   room_id serial PRIMARY KEY,
   name VARCHAR ( 50 ) UNIQUE NOT NULL,
   created_on TIMESTAMP NOT NULL,
   created_by INTEGER NOT NULL
);

CREATE TABLE messages (
   message_id SERIAL PRIMARY KEY,
   sender_id INTEGER NOT NULL,
   receiver_id INTEGER,  -- Null pour les messages de salon
   room_id INTEGER,      -- Null pour les messages privés
   content TEXT NOT NULL,
   sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   
   -- Contraintes de clés étrangères
   FOREIGN KEY (sender_id) REFERENCES users(user_id),
   FOREIGN KEY (receiver_id) REFERENCES users(user_id),
   FOREIGN KEY (room_id) REFERENCES rooms(room_id),
   
   -- Vérifier qu'un message est soit privé, soit un message de salon
   CHECK (
     (receiver_id IS NOT NULL AND room_id IS NULL) OR 
     (receiver_id IS NULL AND room_id IS NOT NULL)
   )
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_room ON messages(room_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at);


insert into users (username, password, email, created_on, external_id) values ('test', 'gcrjEewWyAuYskG3dd6gFTqsC6/SKRsbTZ+g1XHDO10=', 'test@univ-brest.fr', now(), 'ac7a25a9-bcc5-4fba-8a3d-d42acda26949');

insert into rooms (name, created_on, created_by) values ('General', now(), 4);
insert into rooms (name, created_on, created_by) values ('News', now(), 4);
insert into rooms (name, created_on, created_by) values ('Random', now(), 4);