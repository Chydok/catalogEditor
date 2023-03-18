import ReactFauxDom from 'react-faux-dom'
import {observer} from "mobx-react";
import * as d3 from "d3";

import mnemoNodeStore, {IMnemoNode} from "../../stores/mnemoNodeStore";
import {D3DragEvent} from "d3-drag";
import {useEffect} from "react";

interface IViewPanelProps {

}

const ViewPanel = (props: IViewPanelProps) => {
    const curve = d3.curveBumpY;
    const nodes = mnemoNodeStore.nodeList;
    const links = mnemoNodeStore.lineList;

    const graph = new ReactFauxDom.Element('svg');

    d3.select("svg")
        .attr("width", '100%')
        .attr("height", '100%')

    d3.select(graph)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr('stroke', 'black')
        .attr('fill', 'none')
        .attr('d', d3.link<any, IMnemoNode>(curve)
            .x(d => d.x + d.width / 2)
            .y(d => d.y + d.height / 2));

    const rects = d3
        .select(graph)
        .selectAll('g')
        .data(nodes)
        .join('g')

    rects.append('rect')
        .attr('width', (d) => d.width + 8)
        .attr('height', (d) => d.height + 8)
        .attr('x', (d) => d.x - 4)
        .attr('y', (d) => d.y - 4)
        .attr("fill", 'none')
        .attr('stroke', (d) => d.active ? 'blue' : 'none')
        .attr('stroke-width', 3)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('stroke-dasharray', 4);

    rects.append('rect')
        .attr("fill", 'orange')
        .attr('stroke', 'black')
        .attr('width', (d) => d.width)
        .attr('height', (d) => d.height)
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y)
        .attr('id', (d) => d.id)
        .attr('stroke', 'black')
        .style('border-radius', '15px')
        .attr('rx', 5)
        .attr('ry', 5);

    rects.append('text')
        .attr('x', d => d.x + 3)
        .attr('y', d => d.y + d.height / 1.7)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.1)
        .attr('pointer-events', 'none')
        .text(d => d.id);

    useEffect(() => {
        const delta = {x: 0, y: 0};
        const dragStart = (event: D3DragEvent<SVGRectElement, IMnemoNode, IMnemoNode>, d: IMnemoNode) => {
            const currentX = +d3.select('#' + d.id).attr('x');
            const currentY = +d3.select('#' + d.id).attr('y');
            delta.x = event.sourceEvent.x - currentX;
            delta.y = event.sourceEvent.y - currentY;
        }

        const dragged = (event: D3DragEvent<SVGRectElement, IMnemoNode, IMnemoNode>, d: IMnemoNode) => {
            const moveX = event.sourceEvent.x - delta.x;
            const moveY = event.sourceEvent.y - delta.y;
            const x = moveX > 0 ? moveX : 0;
            const y = moveY > 0 ? moveY : 0;
            mnemoNodeStore.changeCoords(d.id, x, y);
        }

        const dragEnd = () => {
            //simulation.alphaTarget(0).restart();
        }
        d3.selectAll('g')
            .data(nodes)
            .on("click", (event, d) => {
                if (event.defaultPrevented) return;
                mnemoNodeStore.setActive(d);
            })
            .call(d3.drag<any, IMnemoNode>()
                .on("start", dragStart)
                .on("drag", dragged)
                .on("end", dragEnd));
    }, [graph, nodes, links, props]);

    return graph!.toReact();
}

export default observer(ViewPanel);
