import React, { useContext } from 'react';
import { styles } from './AffiliateTree.styles';
import { AffiliateTreeContext } from './AffiliateTreeContext';
import { AffiliateTreeHeaderProperties } from './types';
import { formatToCurrency } from './utils';

export const AffiliateTreeHeader: React.FC<AffiliateTreeHeaderProperties> = (props: AffiliateTreeHeaderProperties) => {
    const context = useContext(AffiliateTreeContext);
    const {rootUrl, url, setUrl} = context!;        
    const summary = props.summary;
    const onHeaderClick = () => {
        console.log(url)
        if(url.length > 1) {
            const updatedUrl = [...url];
            updatedUrl.pop();
            setUrl(updatedUrl);
        }
    }
    return (
        <div style={styles.header}>
            <div style={styles.headerTop} ><span onClick={onHeaderClick} style={styles.headerDataLabel}>{props.topTitle}</span></div>
            <div style={styles.headerBottomLeft}>
                <span style={styles.headerDataLabel}>Money Earned</span>
                <span style={styles.headerDataText}>{formatToCurrency(summary.moneyEarned)}</span>
            </div>
            <div style={styles.headerBottomRight}>
                <span style={styles.headerDataLabel}>People Referred</span>
                <span style={styles.headerDataText}>{summary.peopleReferred}</span>
            </div>
        </div>
    )
}
