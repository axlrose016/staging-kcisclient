"use client";

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface AnimatedBackgroundProps {
  className?: string;
}

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function AnimatedBackground({ className }: AnimatedBackgroundProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const numPoints = 50;
    const points: Point[] = Array.from({ length: numPoints }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }));

    const svg = d3.select(svgRef.current);
    svg.attr('width', width).attr('height', height);

    // Create gradient
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#2e4942')
      .attr('stop-opacity', 0.3);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#4DB6AC')
      .attr('stop-opacity', 0.3);

    // Create voronoi diagram
    const voronoi = d3.Delaunay.from(points.map(d => [d.x, d.y])).voronoi([0, 0, width, height]);

    // Create cells
    const cells = svg
      .append('g')
      .selectAll('path')
      .data(points)
      .enter()
      .append('path')
      .attr('d', (_d: Point, i: number) => voronoi.renderCell(i))
      .attr('fill', 'url(#gradient)')
      .attr('stroke', 'rgba(255, 255, 255, 0.1)')
      .attr('stroke-width', 1);

    // Animation
    function animate() {
      points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      const newVoronoi = d3.Delaunay.from(points.map(d => [d.x, d.y])).voronoi([0, 0, width, height]);

      cells.attr('d', (_d: Point, i: number) => newVoronoi.renderCell(i));

      requestAnimationFrame(animate);
    }

    animate();

    // Cleanup
    return () => {
      svg.selectAll('*').remove();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className={`fixed inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  );
} 