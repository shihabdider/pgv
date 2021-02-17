import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { Card, Space } from "antd";
import { withTranslation } from "react-i18next";
import { GrTree } from "react-icons/gr";
import Wrapper from "./index.style";

class PhylogramPanel extends Component {
  render() {
    const { t } = this.props;
    return (
      <Wrapper>
        <Card
          size="small"
          title={
            <Space>
              <span role="img" className="anticon anticon-dashboard">
                <GrTree />
              </span>
              <span className="ant-pro-menu-item-title">
                {t("components.phylogram-panel.header")}
              </span>
            </Space>
          }
        >
          Content
        </Card>
      </Wrapper>
    );
  }
}
PhylogramPanel.propTypes = {};
PhylogramPanel.defaultProps = {};
export default withTranslation("common")(PhylogramPanel);
