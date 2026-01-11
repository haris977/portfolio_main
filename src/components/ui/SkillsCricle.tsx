"use client";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

type Skill = {
  name: string;
  value: number;
};

  const skills: Skill[] = [
  { name: "C++", value: 50 },
  { name: "Python", value: 43 },
  { name: "MySQL", value: 35 },
  { name: "HTML", value: 40 },
  { name: "CSS", value: 39 },
  { name: "JavaScript", value: 40 },
  { name: "Tailwind", value: 42 },
  { name: "React.js", value: 38 },
  { name: "Node.js", value: 36 },
  { name: "Express.js", value: 43 },
  { name: "MongoDB", value: 36 },
  { name: "MS Excel", value: 36 },
  { name: "MS PowerPoint", value: 30 },
  { name: "Cloudinary", value: 32 },
  { name: "Mongoose", value: 34 },
  { name: "DBMS", value: 38 },
  { name: "OOPs", value: 45 },
  { name: "OS", value: 38 },
  { name: "Problem Solving", value: 48 },
  { name: "Time Management", value: 45 },
  { name: "Adaptability", value: 47 },
  { name: "Next.js", value: 34 },
  { name: "Kafka", value: 43 },
  { name: "Docker", value: 39 },
  { name: "TypeScript", value: 41 },
  { name: "Java", value: 45 },
];


const SkillsBubblesFancy: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  if (!containerRef.current || !svgRef.current) return;

  const width = containerRef.current.clientWidth;
  const height = containerRef.current.clientHeight;

  type SkillNode = Skill & {
    radius: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
  };

  const nodes: SkillNode[] = skills.map((skill) => ({
    ...skill,
    radius: skill.value,
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
  }));

  const svg = d3.select(svgRef.current);
  svg.selectAll("*").remove();

  svg
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  svg
    .append("defs")
    .append("pattern")
    .attr("id", "bubblePattern")
    .attr("patternUnits", "objectBoundingBox")
    .attr("width", 1)
    .attr("height", 1)
    .append("image")
    .attr("href", "/bubble_texture.png")
    .attr("preserveAspectRatio", "xMidYMid slice")
    .attr("width", 100)
    .attr("height", 100);

  const node = svg
    .selectAll<SVGGElement, SkillNode>("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "bubble");

  node
    .append("circle")
    .attr("r", (d) => d.radius)
    .attr("fill", "url(#bubblePattern)")
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0.3)
    .attr("stroke-width", 1)
    .attr("opacity", 0.9);

  node
    .append("text")
    .text((d) => d.name)
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .style("fill", "#ffffff")
    .style("font-size", "10px")
    .style("pointer-events", "none");

  const simulation = d3
    .forceSimulation<SkillNode>(nodes)
    .alphaDecay(0)
    .alphaTarget(0.3)
    .velocityDecay(0.05)
    .force(
      "collide",
      d3.forceCollide<SkillNode>().radius((d) => d.radius + 2).iterations(2)
    )
    .force("float", () => {
      for (const d of nodes) {
        d.vx += (Math.random() - 0.5) * 0.2;
        d.vy += (Math.random() - 0.5) * 0.2;
      }
    })
    .on("tick", () => {
      node.attr("transform", (d) => {
        // Wall collision bounce
        if (d.x - d.radius < 0 || d.x + d.radius > width) d.vx *= -1;
        if (d.y - d.radius < 0 || d.y + d.radius > height) d.vy *= -1;

        d.x = Math.max(d.radius, Math.min(width - d.radius, d.x + d.vx));
        d.y = Math.max(d.radius, Math.min(height - d.radius, d.y + d.vy));

        return `translate(${d.x}, ${d.y})`;
      });
    });

  simulation.restart();

  return () => {
    simulation.stop();
  };
}, []);


  return (
    <div
    ref={containerRef}
    className="w-full h-[80vh] flex items-center justify-center bg-transparent">
      <svg ref={svgRef} className="w-full h-full rounded-xl shadow-xl" />
    </div>
  );
};

export default SkillsBubblesFancy;