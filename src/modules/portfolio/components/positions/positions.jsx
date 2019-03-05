import React, { Component } from "react";
import PropTypes from "prop-types";

import FilterBox from "modules/portfolio/containers/filter-box";
import { CompactButton } from "modules/common-elements/buttons";
import { MovementLabel } from "modules/common-elements/labels";
import { MarketPositionsTable } from "modules/portfolio/components/common/tables/market-positions-table";

import Styles from "modules/portfolio/components/common/quads/quad.styles";

const sortByOptions = [
  {
    label: "Sort by Most Recently Traded",
    value: "recentlyTraded",
    comp(marketA, marketB) {
      return (
        marketB.recentlyTraded.timestamp - marketA.recentlyTraded.timestamp
      );
    }
  },
  {
    label: "Sort by Current Value",
    value: "currentValue",
    comp(marketA, marketB) {
      return (
        marketB.myPositionsSummary.currentValue.formatted -
        marketA.myPositionsSummary.currentValue.formatted
      );
    }
  },
  {
    label: "Sort by Total Returns",
    value: "totalReturns",
    comp(marketA, marketB) {
      return (
        marketB.myPositionsSummary.totalReturns.formatted -
        marketA.myPositionsSummary.totalReturns.formatted
      );
    }
  },
  {
    label: "Sort by Expiring Soonest",
    value: "endTime",
    comp(marketA, marketB) {
      return marketA.endTime.timestamp - marketB.endTime.timestamp;
    }
  }
];

function filterComp(input, market) {
  return market.description.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

function renderToggleContent(market) {
  return <MarketPositionsTable market={market} />;
}

export default class Positions extends Component {
  static propTypes = {
    markets: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showCurrentValue: true
    };

    this.updateRightContentValue = this.updateRightContentValue.bind(this);
    this.renderRightContent = this.renderRightContent.bind(this);
  }

  updateRightContentValue() {
    this.setState({ showCurrentValue: !this.state.showCurrentValue });
  }

  renderRightContent(market) {
    const { showCurrentValue } = this.state;

    return showCurrentValue ? (
      market.myPositionsSummary.currentValue.formatted
    ) : (
      <div className={Styles.Quad__column}>
        <span>{market.myPositionsSummary.totalReturns.formatted}</span>
        <MovementLabel
          showPercent
          showPlusMinus
          showColors
          size="small"
          value={market.myPositionsSummary.totalPercent.formatted}
        />
      </div>
    );
  }

  render() {
    const { markets } = this.props;
    const { showCurrentValue } = this.state;

    return (
      <FilterBox
        title="Positions"
        showFilterSearch
        sortByOptions={sortByOptions}
        data={markets}
        filterComp={filterComp}
        bottomTabs
        label="Positions"
        bottomRightContent={
          <CompactButton
            text={showCurrentValue ? "Current Value (ETH)" : "Total Returns"}
            action={this.updateRightContentValue}
          />
        }
        renderRightContent={this.renderRightContent}
        renderToggleContent={renderToggleContent}
        pickVariables={[
          "id",
          "description",
          "reportingState",
          "myPositionsSummary",
          "recentlyTraded",
          "endTime"
        ]}
      />
    );
  }
}
