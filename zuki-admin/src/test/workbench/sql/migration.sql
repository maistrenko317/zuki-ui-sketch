-- /* Create index in s_subscriber to speedup queries by parent id */
USE gameplay;
CREATE INDEX s_subscriber_idx1 ON s_subscriber(mint_parent_subscriber_id);

/* Create index in cash_pooltransactin2_ix TO speed up queries by subscriber_id */
USE contest;
CREATE INDEX cash_pool_transaction2_ix ON cash_pool_transaction2(subscriber_id);

/* Add AFFILIATE role to all non player users */
USE gameplay;
insert into s_subscriber_role(subscriber_id, role)
SELECT a.subscriber_id, 'AFFILIATE' FROM s_subscriber a WHERE NOT (a.subscriber_id  IN (
    SELECT y.subscriber_id FROM s_subscriber x INNER JOIN s_subscriber_role y ON x.subscriber_id = y.subscriber_id
        WHERE y.role ='AFFILIATE' 
) OR (a.nickname LIKE '__player_%' OR a.nickname LIKE 'playerbot_%'));

/* Create index on transaction description to speed up affiliate tree biuld */
USE gameplay;
CREATE INDEX cash_pool_transaction2_idx2 ON cash_pool_transaction2(description(256));

/* Create index on transaction description to speed up affiliate tree biuld */
USE gameplay;
CREATE INDEX s_subscriber_idx2 ON s_subscriber(nickname);

/* */
CREATE VIEW AFFILIATE_TREE_LEVEL_0 AS
SELECT X.subscriber_id, email, nickname, referred_people, amount, transaction_date
FROM (
	SELECT p.subscriber_id, SUM(IF(k.mint_parent_subscriber_id IS NULL, 0, 1)) referred_people 
	FROM s_subscriber p LEFT JOIN s_subscriber k ON p.subscriber_id = k.mint_parent_subscriber_id GROUP BY p.subscriber_id
)  as X INNER JOIN  (
	SELECT s.subscriber_id, email, nickname, sum(amount) amount, max(transaction_date) transaction_date
		FROM s_subscriber s INNER JOIN s_subscriber_role r ON s.subscriber_id = r.subscriber_id 
		INNER JOIN contest.cash_pool_transaction2 c ON c.description = s.nickname AND FIND_IN_SET (`type`, 'PAYOUT_REFERRAL') <> 0
		WHERE r.role = 'AFFILIATE' AND s.mint_parent_subscriber_id IS NULL AND NOT (nickname LIKE '__player_%' OR nickname LIKE 'playerbot_%')
		GROUP BY subscriber_id, email, nickname, mint_parent_subscriber_id
	UNION
	SELECT s.subscriber_id, email, nickname, sum(COALESCE(amount, 0)) amount, max(transaction_date) transaction_date
		FROM s_subscriber s INNER JOIN s_subscriber_role r ON s.subscriber_id = r.subscriber_id 
		LEFT JOIN contest.cash_pool_transaction2 c ON c.description = s.nickname AND FIND_IN_SET (`type`, 'PAYOUT_REFERRAL') <> 0
		WHERE r.role = 'AFFILIATE' AND s.mint_parent_subscriber_id IS NULL AND NOT (nickname LIKE '__player_%' OR nickname LIKE 'playerbot_%') AND amount IS NULL
		GROUP BY subscriber_id, email, nickname, mint_parent_subscriber_id
) as Y ON X.subscriber_id = Y.subscriber_id

/* This view simplifies java code that traverse affiliate trees */
CREATE VIEW AFFILIATE_TREE_LEVEL_N AS
SELECT X.subscriber_id, Y.email, Y.nickname, referred_people, amount, transaction_date, Z.mint_parent_subscriber_id
FROM (
	SELECT p.subscriber_id, SUM(IF(k.mint_parent_subscriber_id IS NULL, 0, 1)) referred_people 
	FROM s_subscriber p LEFT JOIN s_subscriber k ON p.subscriber_id = k.mint_parent_subscriber_id GROUP BY p.subscriber_id
)  as X INNER JOIN  (
	SELECT s.subscriber_id, email, nickname, sum(amount) amount, max(transaction_date) transaction_date
		FROM s_subscriber s INNER JOIN s_subscriber_role r ON s.subscriber_id = r.subscriber_id 
		INNER JOIN contest.cash_pool_transaction2 c ON c.description = s.nickname AND FIND_IN_SET (`type`, 'PAYOUT_REFERRAL') <> 0
		WHERE r.role = 'AFFILIATE' AND NOT (s.mint_parent_subscriber_id IS NULL OR (nickname LIKE '__player_%' OR nickname LIKE 'playerbot_%'))
		GROUP BY subscriber_id, email, nickname, mint_parent_subscriber_id
	UNION
		SELECT s.subscriber_id, email, nickname, sum(COALESCE(amount, 0)) amount, max(transaction_date) transaction_date
		FROM s_subscriber s INNER JOIN s_subscriber_role r ON s.subscriber_id = r.subscriber_id 
		LEFT JOIN contest.cash_pool_transaction2 c ON c.description = s.nickname AND FIND_IN_SET (`type`, 'PAYOUT_REFERRAL') <> 0
		WHERE r.role = 'AFFILIATE' AND NOT (s.mint_parent_subscriber_id IS NULL OR (nickname LIKE '__player_%' OR nickname LIKE 'playerbot_%')) AND amount IS NULL
		GROUP BY subscriber_id, email, nickname, mint_parent_subscriber_id
) as Y ON X.subscriber_id = Y.subscriber_id
	INNER JOIN s_subscriber AS Z ON Z.subscriber_id = X.subscriber_id;

/* LEVEL 1 */
CREATE VIEW LEVEL_1_AFFILIATES AS
select a.subscriber_id, a.nickname, a.mint_parent_subscriber_id, SUM(a.referred_people) referred_people, SUM(a.amount) amount
FROM AFFILIATE_TREE_LEVEL_N a 
group by a.subscriber_id, a.nickname, a.mint_parent_subscriber_id;

/* LEVEL 2 */
CREATE VIEW LEVEL_2_AFFILIATES AS
select a.subscriber_id, a.nickname, a.mint_parent_subscriber_id, SUM(b.referred_people) referred_people, SUM(b.amount) amount
FROM AFFILIATE_TREE_LEVEL_N a INNER JOIN AFFILIATE_TREE_LEVEL_N b ON a.subscriber_id = b.mint_parent_subscriber_id
group by a.subscriber_id, a.nickname, a.mint_parent_subscriber_id;

/* LEVEL 3 */
CREATE VIEW LEVEL_3_AFFILIATES AS
select a.subscriber_id, a.nickname, a.mint_parent_subscriber_id, SUM(c.referred_people) referred_people, SUM(c.amount) amount
FROM AFFILIATE_TREE_LEVEL_N a INNER JOIN AFFILIATE_TREE_LEVEL_N b ON a.subscriber_id = b.mint_parent_subscriber_id	
	INNER JOIN AFFILIATE_TREE_LEVEL_N c ON b.subscriber_id = c.mint_parent_subscriber_id
group by a.subscriber_id, a.nickname, a.mint_parent_subscriber_id;

/* ALL LEVELS AFFILIATES */
CREATE VIEW ALL_LEVELS_AFFILIATES AS
SELECT l1.mint_parent_subscriber_id mint_parent_subscriber_id, l1.subscriber_id, l1.nickname, SUM(l1.referred_people) l1_referred_people, SUM(l1.amount) l1_amount, 
SUM(COALESCE(l2.referred_people, 0)) l2_referred_people, SUM(COALESCE(l2.amount, 0)) l2_amount,
SUM(COALESCE(l3.referred_people, 0)) l3_referred_people, SUM(COALESCE(l3.amount, 0)) l3_amount
FROM LEVEL_1_AFFILIATES l1 LEFT JOIN LEVEL_2_AFFILIATES l2 ON l1.subscriber_id = l2.subscriber_id
	LEFT JOIN LEVEL_3_AFFILIATES l3 ON l1.subscriber_id = l3.subscriber_id
GROUP BY  l1.mint_parent_subscriber_id, l1.subscriber_id, l1.nickname
ORDER BY 3 DESC, 4 DESC, 5 DESC, 6 DESC, 7 DESC,8 DESC;

/* LEVEL 1 EARNINGS */
CREATE VIEW LEVEL_1_EARNINGS AS
select a.transaction_date, a.subscriber_id, a.nickname, a.mint_parent_subscriber_id, SUM(a.amount) amount
FROM AFFILIATE_TREE_LEVEL_N a 
group by a.transaction_date, a.subscriber_id, a.nickname, a.mint_parent_subscriber_id;

/* LEVEL 2 EARNINGS */
CREATE VIEW LEVEL_2_EARNINGS AS
select b.transaction_date, a.subscriber_id, a.nickname, a.mint_parent_subscriber_id, SUM(b.amount) amount
FROM AFFILIATE_TREE_LEVEL_N a INNER JOIN AFFILIATE_TREE_LEVEL_N b ON a.subscriber_id = b.mint_parent_subscriber_id
group by b.transaction_date, a.subscriber_id, a.nickname, a.mint_parent_subscriber_id;

/* LEVEL 3 EARNINGS */
CREATE VIEW LEVEL_3_EARNINGS AS
select c.transaction_date, a.subscriber_id, a.nickname, a.mint_parent_subscriber_id, SUM(c.amount) amount
FROM AFFILIATE_TREE_LEVEL_N a INNER JOIN AFFILIATE_TREE_LEVEL_N b ON a.subscriber_id = b.mint_parent_subscriber_id	
	INNER JOIN AFFILIATE_TREE_LEVEL_N c ON b.subscriber_id = c.mint_parent_subscriber_id
group by c.transaction_date, a.subscriber_id, a.nickname, a.mint_parent_subscriber_id;

/* ALL LEVELS MONTHLY EARNINGS */
CREATE VIEW MONTHLY_EARNINGS AS
SELECT l1.mint_parent_subscriber_id, YEAR(COALESCE(l3.transaction_date, l2.transaction_date, l1.transaction_date)) transaction_year,
MONTH(COALESCE(l3.transaction_date, l2.transaction_date, l1.transaction_date)) transaction_month,
SUM(l1.amount + COALESCE(l2.amount, 0) + COALESCE(l3.amount, 0)) amount
FROM LEVEL_1_EARNINGS l1
	LEFT JOIN LEVEL_2_EARNINGS l2 ON l1.subscriber_id = l2.subscriber_id
		LEFT JOIN LEVEL_3_EARNINGS l3 ON l1.subscriber_id = l3.subscriber_id
WHERE l1.amount + COALESCE(l2.amount, 0) + COALESCE(l3.amount, 0) > 0
GROUP BY  l1.mint_parent_subscriber_id, transaction_year, transaction_month;

/* ALL LEVELS YEARLY EARNINGS */
CREATE VIEW YEARLY_EARNINGS AS
SELECT l1.mint_parent_subscriber_id, YEAR(COALESCE(l3.transaction_date, l2.transaction_date, l1.transaction_date)) transaction_year,
SUM(l1.amount + COALESCE(l2.amount, 0) + COALESCE(l3.amount, 0)) amount
FROM LEVEL_1_EARNINGS l1
	LEFT JOIN LEVEL_2_EARNINGS l2 ON l1.subscriber_id = l2.subscriber_id
		LEFT JOIN LEVEL_3_EARNINGS l3 ON l1.subscriber_id = l3.subscriber_id
WHERE l1.amount + COALESCE(l2.amount, 0) + COALESCE(l3.amount, 0) > 0
GROUP BY l1.mint_parent_subscriber_id, transaction_year;

/* payout range by game */
CREATE VIEW snowyowl.GAME_PAYOUT_RANGE AS
SELECT g.id, MAX(amount) max_amount, MIN(amount) min_amount
FROM contest.game g
INNER JOIN snowyowl.game_payout p ON g.id = p.game_id
INNER JOIN snowyowl.payout_model m ON m.payout_model_id = p.payout_model_id
INNER JOIN payout_table y ON y.game_id = g.id
WHERE NOT amount < 0
GROUP BY g.id;

/* Game names */
CREATE VIEW contest.game_names AS
	SELECT  game_id, game_name FROM (
		SELECT g.id game_id, value game_name, language_code FROM contest.multi_localization l INNER JOIN contest.game g ON l.uuid = g.id WHERE TYPE='gameName' AND language_code = 'en'
		UNION
		SELECT G.id game_id, value game_name, language_code FROM contest.multi_localization L INNER JOIN contest.game G ON L.uuid = G.id WHERE TYPE='gameName' AND NOT language_code = 'en'
	) games

/* game name (english if defined for it or else) */
SELECT game_id, game_name, min_amount min_prize, max_amount top_prize, pending_date
FROM snowyowl.GAME_PAYOUT_RANGE r INNER JOIN contest.game_names N ON r.id = N.game_id INNER JOIN contest.game g ON N.game_id = g.id;