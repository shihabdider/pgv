import styled from "styled-components";

const Wrapper = styled.div`
  .ant-wrapper {
    background: white;
    padding: 0px;
    min-height: 400px;
  }
  div.genome-plot canvas {
    margin: ${props => props.margins.gap}px !important;
    padding: 0px !important;
  }
  svg.plot-container {
    position: absolute;
    top: 0px;
  }
`;

export default Wrapper;