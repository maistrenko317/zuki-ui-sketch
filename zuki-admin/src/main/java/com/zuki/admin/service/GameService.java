package com.zuki.admin.service;

import java.util.Date;
import java.util.List;

import com.zuki.ZukiException;
import com.zuki.dto.GameDTO;

public interface GameService {
    List<GameDTO> getGamesInRange(Date startDate, Date endDate) throws ZukiException;
    List<GameDTO> getGamesInMonth(Date pivotDate) throws ZukiException;
}
