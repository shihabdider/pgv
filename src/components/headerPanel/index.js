import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  PageHeader,
  Space,
  Tag,
  Button,
  Tooltip,
  message,
  Drawer,
  Row,
  Col,
  Switch,
  Divider,
  Menu,
  Dropdown,
} from "antd";
import {
  AiOutlineDownload,
  AiOutlineSetting,
  AiOutlineDown,
} from "react-icons/ai";
import { downloadCanvasAsPng } from "../../helpers/utility";
import html2canvas from "html2canvas";
import Wrapper from "./index.style";
import appActions from "../../redux/app/actions";

const {
  updatePlots,
  updateLegendPin,
  updateGenesPin,
  updatePhylogenyPin,
  updateRenderOutsideViewport,
  updateDomains,
} = appActions;

class HeaderPanel extends Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onDownloadButtonClicked = () => {
    html2canvas(document.body)
      .then((canvas) => {
        downloadCanvasAsPng(
          canvas,
          `${this.props.file.replace(/\s+/g, "_").toLowerCase()}.png`
        );
      })
      .catch((error) => {
        message.error(this.props.t("general.error", { error }));
      });
  };

  onCheckChanged = (checked, index) => {
    let plots = [...this.props.plots];
    plots[index].visible = checked;
    this.props.updatePlots(plots);
  };

  onLegendPinChanged = (checked) => {
    this.props.updateLegendPin(checked);
  };

  onGenesPinChanged = (checked) => {
    this.props.updateGenesPin(checked);
  };

  onPhylogenyPinChanged = (checked) => {
    this.props.updatePhylogenyPin(checked);
  };

  onRenderOutsideViewPortChanged = (checked) => {
    this.props.updateRenderOutsideViewport(checked);
  };

  render() {
    const {
      t,
      description,
      file,
      strainsList,
      tags,
      plots,
      legendPinned,
      genesPinned,
      phylogenyPinned,
      renderOutsideViewPort,
      nodes,
      selectedConnectionsRange,
      selectedConnectionIds,
    } = this.props;
    return (
      <Wrapper>
        <PageHeader
          className="site-page-header"
          title={file}
          subTitle={
            <Space>
              {description.map((d) => (
                <span key={d}>{d}</span>
              ))}
              <span>
                <b>{strainsList.length}</b>{" "}
                {t("containers.home.strain", { count: strainsList.length })}
              </span>
              <Dropdown
                overlay={
                  <Menu>
                    {tags.map((d, i) => (
                      <Menu.Item className="no-click-item" key={d}>
                        {d}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                  href="/#"
                >
                  <Space>
                    <span className="aligned-center" style={{}}>
                      <span>
                        <b>{tags.length}</b>{" "}
                        {t("containers.home.category", { count: tags.length })}
                      </span>
                      &nbsp;
                      <AiOutlineDown />
                    </span>
                  </Space>
                </a>
              </Dropdown>
              <span>
                <b>{nodes.filter((d) => d.selected).length}</b>{" "}
                {t("containers.home.node", {
                  count: nodes.filter((d) => d.selected).length,
                })}
              </span>
              <Button
                type="link"
                onClick={() =>
                  this.props.updateDomains(selectedConnectionsRange)
                }
                disabled={selectedConnectionIds.length < 1}
              >
                <span>
                  <b>{selectedConnectionIds.length}</b>{" "}
                  {t("containers.home.connection", {
                    count: selectedConnectionIds.length,
                  })}
                </span>
              </Button>
            </Space>
          }
          extra={
            <Space>
              <Tooltip title={t("components.download-as-png-tooltip")}>
                <Button
                  type="text"
                  shape="circle"
                  icon={<AiOutlineDownload />}
                  size="small"
                  onClick={() => this.onDownloadButtonClicked()}
                />
              </Tooltip>
              <Tooltip title={t("components.settings.tooltip")}>
                <Button
                  type="text"
                  shape="circle"
                  icon={<AiOutlineSetting />}
                  size="small"
                  onClick={this.showDrawer}
                />
              </Tooltip>
            </Space>
          }
        >
          <Drawer
            title={t("components.settings.title")}
            placement="right"
            closable={true}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Divider>{t("components.settings-panel.pinning")}</Divider>
              </Col>
              <Col span={24}>
                <Space>
                  <Switch
                    onChange={(checked) => this.onLegendPinChanged(checked)}
                    size="small"
                    checked={legendPinned}
                  />
                  {t("components.settings-panel.legend-pinned")}
                </Space>
              </Col>
              <Col span={24}>
                <Space>
                  <Switch
                    onChange={(checked) => this.onGenesPinChanged(checked)}
                    size="small"
                    checked={genesPinned}
                  />
                  {t("components.settings-panel.genes-pinned")}
                </Space>
              </Col>
              <Col span={24}>
                <Space>
                  <Switch
                    onChange={(checked) => this.onPhylogenyPinChanged(checked)}
                    size="small"
                    checked={phylogenyPinned}
                  />
                  {t("components.settings-panel.phylogeny-pinned")}
                </Space>
              </Col>
              <Col span={24}>
                <Divider>
                  {t("components.settings-panel.plot-visibility")}
                </Divider>
              </Col>
              {plots.map((d, index) => (
                <Col span={24}>
                  <Space>
                    <Switch
                      onChange={(checked) =>
                        this.onCheckChanged(checked, index)
                      }
                      size="small"
                      checked={d.visible}
                    />
                    {d.title}
                  </Space>
                </Col>
              ))}
              <Col span={24}>
                <Tooltip
                  title={t(
                    "components.settings-panel.render-outside-viewport-help"
                  )}
                >
                  <Space>
                    <Switch
                      onChange={(checked) =>
                        this.onRenderOutsideViewPortChanged(checked)
                      }
                      size="small"
                      checked={renderOutsideViewPort}
                    />
                    {t("components.settings-panel.render-outside-viewport")}
                  </Space>
                </Tooltip>
              </Col>
            </Row>
          </Drawer>
        </PageHeader>
      </Wrapper>
    );
  }
}
HeaderPanel.propTypes = {
  description: PropTypes.array,
  file: PropTypes.string,
  strainsList: PropTypes.array,
  tags: PropTypes.array,
};
HeaderPanel.defaultProps = {
  strainsList: [],
  description: [],
  tags: [],
};
const mapDispatchToProps = (dispatch) => ({
  updatePlots: (plots) => dispatch(updatePlots(plots)),
  updateLegendPin: (legendPinned) => dispatch(updateLegendPin(legendPinned)),
  updateGenesPin: (genesPinned) => dispatch(updateGenesPin(genesPinned)),
  updatePhylogenyPin: (phylogenyPinned) => dispatch(updatePhylogenyPin(phylogenyPinned)),
  updateRenderOutsideViewport: (renderOutsideViewPort) =>
    dispatch(updateRenderOutsideViewport(renderOutsideViewPort)),
  updateDomains: (domains) => dispatch(updateDomains(domains)),
});
const mapStateToProps = (state) => ({
  plots: state.App.plots,
  legendPinned: state.App.legendPinned,
  genesPinned: state.App.genesPinned,
  phylogenyPinned: state.App.phylogenyPinned,
  renderOutsideViewPort: state.App.renderOutsideViewPort,
  nodes: state.App.nodes,
  selectedConnectionIds: state.App.selectedConnectionIds,
  selectedConnectionsRange: state.App.selectedConnectionsRange,
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(HeaderPanel));
