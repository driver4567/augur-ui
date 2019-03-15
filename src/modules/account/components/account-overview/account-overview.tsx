import React from "react";

import * as constants from "modules/common-elements/constants";
import QuadBox from "modules/portfolio/components/common/quads/quad-box";
import { PillSelection } from "modules/common-elements/selection";
import AccountOverviewFunds from "modules/account/containers/account-overview-funds";
import AccountOverviewStats from "modules/account/containers/account-overview-stats";
import AccountOverviewChart from "modules/account/containers/account-overview-chart";
import Styles from "modules/account/components/account-overview/account-overview.styles";

export interface AccountOverviewProps {}

interface AccountOverviewState {
  selected: number;
  updateTimeSelection: Function;
}

export default class AccountOverview extends React.Component<
  AccountOverviewProps,
  AccountOverviewState
> {
  state: AccountOverviewState = {
    selected: constants.TIMEFRAME_OPTIONS[0].id
  };

  componentDidMount() {
    this.props.updateTimeframeData({
      endTime: constants.TIMEFRAME_OPTIONS[0].id
    });
  }

  updateTimeSelection = id => {
    this.setState({ selected: id });
    this.props.updateTimeframeData({ endTime: id });
  };

  render() {
    const { selected } = this.state;

    return (
      <QuadBox
        title={constants.YOUR_OVERVIEW_TITLE}
        rightContent={
          <PillSelection
            options={constants.TIMEFRAME_OPTIONS}
            defaultSelection={constants.TIMEFRAME_OPTIONS[0].id}
            onChange={this.updateTimeSelection}
          />
        }
        content={
          <div className={Styles.AccountOverview}>
            <AccountOverviewFunds />
            <AccountOverviewStats timeframe={selected} />
            <AccountOverviewChart timeframe={selected} />
          </div>
        }
      />
    );
  }
}