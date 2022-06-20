package com.zuki.admin.dao;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.zuki.ZukiException;
import com.zuki.dto.GameDTO;

@Repository
public class GameDAOImpl  implements GameDAO{
    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    public List<GameDTO> getGamesInRange(Date startDate, Date endDate) throws ZukiException {
        try { 
            return namedParameterJdbcTemplate.query(
                "SELECT game_id, game_name, min_amount min_prize, max_amount top_prize, pending_date, g.game_photo_url "+
                "FROM snowyowl.GAME_PAYOUT_RANGE r INNER JOIN contest.game_names N ON r.id = N.game_id INNER JOIN contest.game g ON N.game_id = g.id "+
                "WHERE pending_date BETWEEN :startDate AND :endDate ORDER BY pending_date",
                new MapSqlParameterSource(Map.of("startDate", startDate, "endDate", endDate)),
                (rs, rowNum) -> new GameDTO(
                    rs.getString("game_id"),
                    rs.getString("game_name"),
                    rs.getTimestamp("pending_date"),
                    rs.getDouble("min_prize"),
                    rs.getDouble("top_prize"),
                    rs.getString("game_photo_url")
                )
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve future games", e);
        }   
    }
}
