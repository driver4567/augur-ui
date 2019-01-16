import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { BigNumber, createBigNumber } from "utils/create-big-number";

import TradingForm from "modules/trading/components/trading--form/trading--form";
import TradingConfirm from "modules/trading/components/trading--confirm/trading--confirm";
import { Close } from "modules/common/components/icons";

import ValueDenomination from "modules/common/components/value-denomination/value-denomination";

import getValue from "utils/get-value";
import { isEqual } from "lodash";
import { FindReact } from "utils/find-react";
import { SCALAR } from "modules/markets/constants/market-types";
import { BUY, SELL } from "modules/transactions/constants/types";
import MarketOutcomeTradingIndicator from "modules/market/containers/market-outcome-trading-indicator";
import Styles from "modules/trading/components/trading--wrapper/trading--wrapper.styles";

class TradingWrapper extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    isLogged: PropTypes.bool.isRequired,
    selectedOrderProperties: PropTypes.object.isRequired,
    availableFunds: PropTypes.instanceOf(BigNumber).isRequired,
    isMobile: PropTypes.bool.isRequired,
    toggleForm: PropTypes.func.isRequired,
    showOrderPlaced: PropTypes.func.isRequired,
    clearTradeInProgress: PropTypes.func.isRequired,
    selectedOutcome: PropTypes.object,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
    handleFilledOnly: PropTypes.func.isRequired,
    gasPrice: PropTypes.number.isRequired,
    updateSelectedOutcome: PropTypes.func.isRequired
  };

  static defaultProps = {
    selectedOutcome: null
  };

  constructor(props) {
    super(props);

    this.state = {
      orderPrice: props.selectedOrderProperties.price || "",
      orderQuantity: props.selectedOrderProperties.quantity || "",
      orderEthEstimate: "0",
      orderShareEstimate: "0",
      selectedNav: props.selectedOrderProperties.selectedNav || BUY,
      doNotCreateOrders:
        props.selectedOrderProperties.doNotCreateOrders || false
    };

    this.updateState = this.updateState.bind(this);
    this.clearOrderForm = this.clearOrderForm.bind(this);
    this.updateOrderEthEstimate = this.updateOrderEthEstimate.bind(this);
    this.updateOrderShareEstimate = this.updateOrderShareEstimate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { selectedOrderProperties } = this.props;

    if (
      this.props.selectedOutcome === null ||
      !(nextProps.selectedOutcome || {}).trade
    )
      return this.clearOrderForm();
    const nextTotalCost = createBigNumber(
      nextProps.selectedOutcome.trade.totalCost.formattedValue,
      10
    );
    const nextShareCost = createBigNumber(
      nextProps.selectedOutcome.trade.shareCost.formattedValue,
      10
    );

    if (nextTotalCost.abs().toString() !== this.state.orderEthEstimate) {
      this.setState({
        orderEthEstimate: nextTotalCost.abs().toString()
      });
    }

    if (nextShareCost !== this.state.orderShareEstimate) {
      this.setState({
        orderShareEstimate: nextShareCost.abs().toString()
      });
    }

    // Updates from chart clicks
    if (!isEqual(selectedOrderProperties, nextProps.selectedOrderProperties)) {
      this.setState({ ...nextProps.selectedOrderProperties });
    }
  }

  updateState(property, value) {
    this.setState({ [property]: value }, () => {
      this.props.updateSelectedOrderProperties({
        orderPrice: this.state.orderPrice,
        orderQuantity: this.state.orderQuantity,
        doNotCreateOrders: this.state.doNotCreateOrders,
        selectedNav: this.state.selectedNav
      });
    });
  }

  clearOrderForm() {
    const { clearTradeInProgress, market } = this.props;
    if (market.id) clearTradeInProgress(market.id);
    this.setState({
      orderPrice: "",
      orderQuantity: "",
      orderEthEstimate: "0",
      orderShareEstimate: "0",
      doNotCreateOrders: false
    });
  }

  updateOrderEthEstimate(orderEthEstimate) {
    this.setState({
      orderEthEstimate
    });
  }

  updateOrderShareEstimate(orderShareEstimate) {
    this.setState({
      orderShareEstimate
    });
  }

  render() {
    const {
      availableFunds,
      isLogged,
      isMobile,
      market,
      selectedOutcome,
      toggleForm,
      showOrderPlaced,
      gasPrice,
      handleFilledOnly,
      updateSelectedOutcome
    } = this.props;
    const s = this.state;

    const lastPrice = getValue(
      this.props,
      "selectedOutcome.lastPrice.formatted"
    );

    return (
      <section className={Styles.TradingWrapper}>
        {isMobile && (
          <div className={Styles["TradingWrapper__mobile-header"]}>
            <button
              className={Styles["TradingWrapper__mobile-header-close"]}
              onClick={toggleForm}
            >
              {Close}
            </button>
            <span className={Styles["TradingWrapper__mobile-header-outcome"]}>
              {selectedOutcome.name}
            </span>
            <span className={Styles["TradingWrapper__mobile-header-last"]}>
              <ValueDenomination formatted={lastPrice} />
              <MarketOutcomeTradingIndicator
                isMobile={isMobile}
                outcome={selectedOutcome}
                location="modileTradingForm"
              />
            </span>
          </div>
        )}
        <div>
          <ul
            className={classNames({
              [Styles.TradingWrapper__header_buy]: s.selectedNav === BUY,
              [Styles.TradingWrapper__header_sell]: s.selectedNav === SELL
            })}
          >
            <li
              className={classNames({
                [`${Styles.active_buy}`]: s.selectedNav === BUY
              })}
            >
              <button onClick={() => this.setState({ selectedNav: BUY })}>
                <div>Buy Shares</div>
                <span
                  className={classNames(Styles.TradingWrapper__underline__buy, {
                    [`${Styles.notActive}`]: s.selectedNav === SELL
                  })}
                />
              </button>
            </li>
            <li
              className={classNames({
                [`${Styles.active_sell}`]: s.selectedNav === SELL
              })}
            >
              <button onClick={() => this.setState({ selectedNav: SELL })}>
                <div>Sell Shares</div>
                <span
                  className={classNames(
                    Styles.TradingWrapper__underline__sell,
                    {
                      [`${Styles.notActive}`]: s.selectedNav === BUY
                    }
                  )}
                />
              </button>
            </li>
          </ul>
          {market.marketType === SCALAR && (
            <div className={Styles.TradingWrapper__scalar__line} />
          )}
          {!isLogged && (
            <button
              id="login-button"
              className={Styles["TradingWrapper__button--login"]}
              onClick={() =>
                FindReact(
                  document.getElementsByClassName(
                    "connect-account-styles_ConnectAccount"
                  )[0]
                ).toggleDropdown()
              }
            >
              Sign in to trade
            </button>
          )}
          <TradingForm
            market={market}
            marketType={getValue(this.props, "market.marketType")}
            maxPrice={getValue(this.props, "market.maxPrice")}
            minPrice={getValue(this.props, "market.minPrice")}
            availableFunds={availableFunds}
            selectedNav={s.selectedNav}
            orderPrice={s.orderPrice}
            orderQuantity={s.orderQuantity}
            orderEthEstimate={s.orderEthEstimate}
            orderShareEstimate={s.orderShareEstimate}
            doNotCreateOrders={s.doNotCreateOrders}
            selectedOutcome={selectedOutcome}
            updateState={this.updateState}
            isMobile={isMobile}
            gasPrice={gasPrice}
            updateSelectedOutcome={updateSelectedOutcome}
          />
        </div>

        {selectedOutcome &&
          selectedOutcome.trade &&
          selectedOutcome.trade.limitPrice && (
            <TradingConfirm
              market={market}
              selectedNav={s.selectedNav}
              orderPrice={s.orderPrice}
              orderQuantity={s.orderQuantity}
              orderEthEstimate={s.orderEthEstimate}
              doNotCreateOrders={s.doNotCreateOrders}
              selectedOutcome={selectedOutcome}
              trade={selectedOutcome.trade}
              isMobile={isMobile}
              clearOrderForm={this.clearOrderForm}
              showOrderPlaced={showOrderPlaced}
              handleFilledOnly={handleFilledOnly}
            />
          )}
      </section>
    );
  }
}

export default TradingWrapper;
