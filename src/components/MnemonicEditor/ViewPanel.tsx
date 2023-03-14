import {useEffect} from "react";
import ReactFauxDom from 'react-faux-dom'
import {observer} from "mobx-react";
import * as d3 from "d3";

import mnemoNodeStore, {IMnemoNode} from "../../stores/mnemoNodeStore";
import {D3DragEvent} from "d3-drag";

const ViewPanel = () => {
    const nodes = mnemoNodeStore.nodeList;
    const links = mnemoNodeStore.lineList;

    const graph = new ReactFauxDom.Element('svg');

    d3.select("svg")
      .attr("width", '100%')
      .attr("height", '100%')

    d3.select(graph)
        .selectAll(".link")
        .data(links)
        .join("line")
        .attr("x1", d => d.source.x + d.source.width / 2)
        .attr("y1", d => d.source.y + d.source.height / 2)
        .attr("x2", d => d.target.x + d.target.width / 2)
        .attr("y2", d => d.target.y + d.target.height / 2)
        .attr('stroke', 'black')
        .classed("link", true);

    const rects = d3
        .select(graph)
        .selectAll('rect')
        .data(nodes);

    rects.enter()
        .append('rect')
        .attr("fill", 'orange')
        .attr('width', (d) => d.width)
        .attr('height', (d) => d.height)
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y)
        .attr('id', (d) => d.id);

    useEffect(() => {
        const delta = {x: 0, y: 0};
        const dragStart = (event: D3DragEvent<SVGRectElement, IMnemoNode, IMnemoNode>, d: IMnemoNode) => {
            const currentX = +d3.select('#' + d.id).attr('x');
            const currentY = +d3.select('#' + d.id).attr('y');
            delta.x = event.sourceEvent.x - currentX;
            delta.y = event.sourceEvent.y - currentY;
        }

        const dragged = (event: D3DragEvent<SVGRectElement, IMnemoNode, IMnemoNode>, d: IMnemoNode) => {
            const x = event.sourceEvent.x - delta.x;
            const y = event.sourceEvent.y - delta.y;
            mnemoNodeStore.changeCoords(d.id, x, y);
        }

        const dragEnd = () => {
            //simulation.alphaTarget(0).restart();
        }

        d3.selectAll('rect').data(mnemoNodeStore.nodeList).call(d3
            .drag<any, IMnemoNode>()
                .on("start", dragStart)
                .on("drag", dragged)
                .on("end", dragEnd));
    }, [nodes, links]);

    return graph!.toReact();
}

export default observer(ViewPanel);
