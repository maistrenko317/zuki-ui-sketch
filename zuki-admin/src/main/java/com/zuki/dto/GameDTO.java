package com.zuki.dto;

import java.io.Serializable;
import java.util.Date;

public class GameDTO implements Serializable{
    String id;
    String name;
    Date pendingDate;
    double minPrize;
    double topPrize;
    String photoUrl;

    public GameDTO() {

    }

    
    public GameDTO(String id, String name, Date pendingDate, double minPrize, double topPrize) {
        this.id = id;
        this.name = name;
        this.pendingDate = pendingDate;
        this.minPrize = minPrize;
        this.topPrize = topPrize;
    }

    public GameDTO(String id, String name, Date pendingDate, double minPrize, double topPrize, String photoUrl) {
        this.id = id;
        this.name = name;
        this.pendingDate = pendingDate;
        this.minPrize = minPrize;
        this.topPrize = topPrize;
        this.photoUrl = photoUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getPendingDate() {
        return pendingDate;
    }

    public void setPendingDate(Date pendingDate) {
        this.pendingDate = pendingDate;
    }

    public double getMinPrize() {
        return minPrize;
    }

    public void setMinPrize(double minPrize) {
        this.minPrize = minPrize;
    }

    public double getTopPrize() {
        return topPrize;
    }

    public void setTopPrize(double topPrize) {
        this.topPrize = topPrize;
    }


    public String getPhotoUrl() {
        return photoUrl;
    }


    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    
    
}
