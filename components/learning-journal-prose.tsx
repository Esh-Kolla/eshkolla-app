"use client";

import { MDXRemote } from "next-mdx-remote/rsc";
import BarChart from "@/components/charts/bar-chart";
import Chart from "@/components/charts/chart";
import InferenceChart from "@/components/charts/inference-chart";
import FlowDiagram from "@/components/charts/flow-diagram";
import Terminal from "@/components/charts/terminal";
import Callout from "@/components/charts/callout";
import PipelineDiagram from "@/components/charts/pipeline-diagram";
import GradientDescentChart from "@/components/charts/gradient-descent-chart";
import PerceptronChart from "@/components/charts/perceptron-chart";
import readingTime from "reading-time";

interface LearningJournalProseProps {
  source: string;
}

export default function LearningJournalProse({ source }: LearningJournalProseProps) {
  const { text } = readingTime(source);

  return (
    <div className="lj-reading-width">
      <article className="learning-journal-prose space-y-6">
        <MDXRemote
          source={source}
          components={{
            BarChart,
            Chart,
            InferenceChart,
            FlowDiagram,
            Terminal,
            Callout,
            PipelineDiagram,
            GradientDescentChart,
            PerceptronChart,

            // Typography components
            // These will be styled via CSS classes
            Standard: ({ children }: { children: React.ReactNode }) => (
              <p className="lj-p">{children}</p>
            ),
            Technical: ({ children }: { children: React.ReactNode }) => (
              <div className="lj-section-technical">{children}</div>
            ),
            Observation: ({ children }: { children: React.ReactNode }) => (
              <div className="lj-section-observation">{children}</div>
            ),
            Synthesis: ({ children }: { children: React.ReactNode }) => (
              <div className="lj-section-synthesis">{children}</div>
            ),
            Discovery: ({ children }: { children: React.ReactNode }) => (
              <div className="lj-section-discovery">{children}</div>
            ),
          }}
        />
      </article>
    </div>
  );
}
