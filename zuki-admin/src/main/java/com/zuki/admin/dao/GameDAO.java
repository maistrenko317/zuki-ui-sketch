package com.zuki.admin.dao;

import java.util.Date;
import java.util.List;

import com.zuki.ZukiException;
import com.zuki.dto.GameDTO;

public interface GameDAO {
    List<GameDTO> getGamesInRange(Date startDate, Date endDate) throws ZukiException;
}
