import ReactFauxDom from 'react-faux-dom'
import {observer} from "mobx-react";
import * as d3 from "d3";

import mnemoNodeStore, {IMnemoNode} from "../../stores/mnemoNodeStore";
import {D3DragEvent} from "d3-drag";
import {useEffect, useRef, useState} from "react";

const ViewPanel = () => {
    const curve = d3.curveStep;
    const currentBoard = useRef<HTMLDivElement>(null);
    const [mainDivWidth, setMainDivWidth] = useState<number>(0);
    const [mainDivHeigth, setMainDivHeigth] = useState<number>(0);
    const [scrollLeft, setScrollLeft] = useState<number>(0);
    const [scrollTop, setScrollTop] = useState<number>(0);

    const filtredNodes = mnemoNodeStore.nodeList.filter((rect) => {
        if (currentBoard.current) {
            const parrentDivWidth: number = mainDivWidth;
            const parrentDivHeight: number = mainDivHeigth;
            const x1 = rect.x;
            const x2 = rect.x + rect.width;
            const y1 = rect.y;
            const y2 = rect.y + rect.height;
            if ((x2 > scrollLeft && y2 > scrollTop) && (x1 < scrollLeft + parrentDivWidth && y1 < scrollTop + parrentDivHeight)) {
                return rect;
            }
        }
        return false;
    });

    const filtredLines = mnemoNodeStore.lineList.filter((line) => {
        if (currentBoard.current) {
            const parrentDivWidth: number = mainDivWidth;
            const parrentDivHeight: number = mainDivHeigth;
            const x1 = line.source.x + line.source.width / 2;
            const y1 = line.source.y + line.source.height / 2;
            const x2 = line.target.x + line.target.width / 2;
            const y2 = line.target.y + line.target.height / 2;

            if (scrollLeft < x1 && x1 < scrollLeft + parrentDivWidth && scrollTop < y1 && y1 < scrollTop + parrentDivHeight) {
                return line;
            }

            if (scrollLeft < x2 && x2 < scrollLeft + parrentDivWidth && scrollTop < y2 && y2 < scrollTop + parrentDivHeight) {
                return line;
            }
        }

        return false;
    });

    // eslint-disable-next-line
    const graph = new ReactFauxDom.Element('svg');

    d3.select('svg')
        .attr('width', '1600px')
        .attr('height', '1000px');

    d3.select(graph)
        .selectAll('path')
        .data(filtredLines)
        .join('path')
        .attr('stroke', 'black')
        .attr('fill', 'none')
        .attr('d', d3.link<any, IMnemoNode>(curve)
            .x(d => d.x + d.width / 2)
            .y(d => d.y + d.height / 2));

    const rects = d3
        .select(graph)
        .selectAll('g')
        .data(filtredNodes)
        .join('g');

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
        .attr('fill', 'orange')
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
            .data(filtredNodes)
            .on('click', (event, d) => {
                if (event.defaultPrevented) return;
                mnemoNodeStore.setActive(d);
            })
            .call(d3.drag<any, IMnemoNode>()
                .on('start', dragStart)
                .on('drag', dragged)
                .on('end', dragEnd));
    }, [filtredNodes, filtredLines]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((elem) => {
            setMainDivHeigth(currentBoard.current?.offsetHeight || 0);
            setMainDivWidth(currentBoard.current?.offsetWidth || 0);
        });
        if (currentBoard.current) {
            resizeObserver.observe(currentBoard.current);
        }
        return () => resizeObserver.disconnect();
    },[]);

    return (
        <div
            ref={currentBoard}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
            }}
            onScroll={(event) => {
                setScrollLeft(event.currentTarget.scrollLeft);
                setScrollTop(event.currentTarget.scrollTop);
            }}
            >
            {graph!.toReact()}
        </div>
    );
}

export default observer(ViewPanel);
