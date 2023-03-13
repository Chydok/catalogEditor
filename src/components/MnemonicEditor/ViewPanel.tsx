import React, {useEffect, useMemo, useState} from "react";
import ReactFauxDom from 'react-faux-dom'
import * as d3 from "d3";

const ViewPanel = () => {
    const [animatedNodes, setAnimatedNodes] = useState([]);

    const nodes = useMemo(
        () =>
            [{id: "test1", r: 50, x: 100, y: 20}, {id: "test2", r: 50, x: 200, y: 20}, {id: "test3", r: 50, x: 300, y: 20}].map(el => {
                return el;
            }),
        []
    );
    const links = [{source: nodes[0],target: nodes[1]}, {source: nodes[1],target: nodes[2]}]

    const graph = new ReactFauxDom.Element('svg');

    d3.select("svg")
      .attr("width", '100%')
      .attr("height", '100%')

    const link = d3
        .select(graph)
        .selectAll(".link")
        .data(links)
        .join("line")
        .attr("x1", d => d.source.x + d.source.r / 2)
        .attr("y1", d => d.source.y + d.source.r / 2)
        .attr("x2", d => d.target.x + d.target.r / 2)
        .attr("y2", d => d.target.y + d.target.r / 2)
        .attr('stroke', 'black')
        .classed("link", true);

    const rects = d3
        .select(graph)
        .selectAll('rect')
        .data(nodes);

    rects.enter()
        .append('rect')
        .attr("fill", 'orange')
        .attr('width', (d) => d.r)
        .attr('height', (d) => d.r)
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y)
        .attr('id', (d) => d.id);

    // @ts-ignore
    useEffect(() => {
        const delta = {x: 0, y: 0};
        // @ts-ignore
        const dragStart = (event, d) => {
            simulation.alphaTarget(0.3).restart()
            const currentX = +d3.select('#' + d.id).attr('x');
            const currentY = +d3.select('#' + d.id).attr('y');
            delta.x = event.sourceEvent.x - currentX;
            delta.y = event.sourceEvent.y - currentY;
        }
        // @ts-ignore
        const dragged = (event, d) => {
            d.x = event.sourceEvent.x - delta.x;
            d.y = event.sourceEvent.y - delta.y;
        }

        const dragEnd = () => {
            simulation.alphaTarget(0).restart();
        }

        const simulation = d3.forceSimulation()
            .nodes(nodes)
            //.force("charge", d3.forceManyBody())
            //.force("link", d3.forceLink(links));

        simulation.on("tick", () => {
            // @ts-ignore
            setAnimatedNodes([...simulation.nodes()]);
        });

        simulation.alpha(0.1).restart();
        d3.selectAll('rect').data(animatedNodes).call(
            // @ts-ignore
            d3.drag()
                // @ts-ignore
                .on("start", dragStart)
                // @ts-ignore
                .on("drag", dragged)
                // @ts-ignore
                .on("end", dragEnd));
        return () => simulation.stop();
    }, [graph, nodes, links]);

    return graph!.toReact();
}

export default ViewPanel;
