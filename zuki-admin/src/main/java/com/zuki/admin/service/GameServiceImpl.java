package com.zuki.admin.service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zuki.ZukiException;
import com.zuki.admin.dao.GameDAO;
import com.zuki.dto.GameDTO;
import com.zuki.functional.Tempo;

@Service
public class GameServiceImpl implements GameService {
    @Autowired
    GameDAO gameDAO;

    @Override
    public List<GameDTO> getGamesInRange(Date startDate, Date endDate) throws ZukiException {
        return gameDAO.getGamesInRange(startDate, endDate);
    }
 
    @Override
    public List<GameDTO> getGamesInMonth(Date pivotDate) throws ZukiException {
        Date startDate = Tempo.firstDateOfMonth(pivotDate);
        Date endDate = Tempo.lastDateOfMonth(pivotDate);
        return getGamesInRange(startDate, endDate);
    }
}