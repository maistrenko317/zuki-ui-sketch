USE gameplay;
/* SELECT email, a.role FROM gameplay.s_subscriber_role a  INNER JOIN s_subscriber b ON a.subscriber_id = b.subscriber_id ORDER BY a.role; */
SELECT nickname, a.role 
FROM gameplay.s_subscriber_role a  INNER JOIN s_subscriber b ON a.subscriber_id = b.subscriber_id 
ORDER BY nickname;
