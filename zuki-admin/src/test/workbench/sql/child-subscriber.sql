create table s_subscriber
(
    subscriber_id             int not null,
    email                     int not null,
    nickname                  int not null,
    create_date               int not null,
    mint_parent_subscriber_id int not null
);
SELECT subscriber_id, email, nickname, create_date, mint_parent_subscriber_id FROM s_subscriber WHERE NOT (mint_parent_subscriber_id IS NULL OR (nickname LIKE '__player_%' OR nickname LIKE 'playerbot_%'));
