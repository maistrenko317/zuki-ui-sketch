package com.zuki.dto;

import java.util.List;

public class ReferralReportDTO {
    List<ReferralTreeNodeDTO> referralTreeNodes;
    ReferralInfoDTO referralInfo;

    public ReferralReportDTO() {

    }

    public ReferralReportDTO(List<ReferralTreeNodeDTO> referralTreeNodes, ReferralInfoDTO referralInfo) {
        this.referralTreeNodes = referralTreeNodes;
        this.referralInfo = referralInfo;
    }

    public List<ReferralTreeNodeDTO> getReferralTreeNodes() {
        return referralTreeNodes;
    }

    public void setReferralTreeNodes(List<ReferralTreeNodeDTO> referralTreeNodes) {
        this.referralTreeNodes = referralTreeNodes;
    }

    public ReferralInfoDTO getReferralInfo() {
        return referralInfo;
    }

    public void setReferralInfo(ReferralInfoDTO referralInfo) {
        this.referralInfo = referralInfo;
    }

    
}
