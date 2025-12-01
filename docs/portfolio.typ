#import "@preview/fontawesome:0.5.0": *

// --- Configuration & Styling ---
#set page(
  paper: "a4",
  margin: (x: 0.5in, y: 0.5in),
)
#set text(
  font: "New Computer Modern",
  size: 10pt,
  lang: "en"
)
#set par(justify: true, leading: 0.6em)

// Helper for section headings
#let section(title) = {
  v(8pt)
  text(weight: "bold", size: 12pt, smallcaps(title))
  v(-3pt)
  line(length: 100%, stroke: 0.5pt)
  v(3pt)
}

// Helper for generic entries (Education, Experience)
#let item(title, subtitle, date, location: none, content) = {
  grid(
    columns: (1fr, auto),
    row-gutter: 0pt,
    {
      if subtitle != none {
        text(weight: "bold")[#title] + " | " + subtitle
      } else {
        text(weight: "bold")[#title]
      }
    },
    align(right)[#text(weight: "bold")[#date]]
  )
  if location != none {
    v(-5pt)
    text(style: "italic")[#location]
  }
  if content != none {
    v(3pt)
    set list(indent: 0pt, marker: [•])
    content
  }
}

// Helper for Project entries
#let project(name, tech, source, demo, content) = {
  grid(
    columns: (1fr, auto),
    {
      text(weight: "bold")[#name] + " (" + tech + ")"
    },
    {
      if source != none { link(source)[Source Code] }
      if source != none and demo != none { " — " }
      if demo != none { link(demo)[Live Demo] }
    }
  )
  v(3pt)
  set list(indent: 0pt, marker: [•])
  content
}

// --- Header ---
#align(center)[
  #text(size: 20pt, weight: "bold", smallcaps("Dileep Kumar Adari")) \
  Visakhapatnam, Andhra Pradesh, India - 531033 \
  #fa-phone() +91 7330701217 #h(5pt)
  #fa-envelope() #link("mailto:dileepkumar.adari@students.iiit.ac.in")[dileepkumar.adari\@students.iiit.ac.in] #h(5pt)
  #fa-linkedin() #link("https://linkedin.com/in/dileep-kumar-adari/")[LinkedIn] #h(5pt)
  #fa-user() #link("https://dileepadari.dev")[dileepadari.dev] #h(5pt)
  #fa-github() #link("https://github.com/Dileepadari")[Dileepadari]
]
// --- Education ---
#section("Education")

#grid(
  columns: (1fr, auto),
  [*International Institute of Information Technology, Hyderabad*], [Aug 2022 - Present]
)
#grid(
  columns: (1fr, auto),
  [Bachelor of Technology in Computer Science & Engineering with Honors], [Expected Graduation - May 2026]
)
#v(5pt)
*Coursework:* • Data Structures and Algorithms • Operating Systems and Networks • Database Management Systems \ • Software Engineering • Information Security • Data Analytics • IoT • Embedded Systems • Computer Graphics

// --- Experience ---
#section("Experience")

#item(
  "Google Summer of Code 2025", "Joomla! CMS", "May 2025 - Sep 2025"
)[
  - Engineered a robust, end-to-end *workflow management* solution with an intuitive visual tool that simplified article stage management in Joomla CMS, consolidating a 6-7 page process into a single, unified interface.
  - Spearheaded 2 concurrent projects including a plugin using Vue.js, PHP, and the Joomla Framework, significantly improving project delivery timelines by two weeks through proactive open-source collaboration and communication.
]

#item(
  "Undergraduate Researcher", "SERC Lab, IIIT Hyderabad", "Apr 2024 - Present"
)[
  - Investigating the core principles of applied *human-centered design* and *human-computer interaction* under *Dr. Raman Saxena* from 15 months to enhance user satisfaction and system usability within complex software environments.
  - Implemented key, user-centric ERP system enhancements used by 4,000+ people by applying design thinking, usability testing, and accessibility best practices, streamlining workflows for over ten use cases and measurably improving user satisfaction.
]

#item(
  "Software Engineering Intern", "Virtual Labs", "Jan 2024 - Apr 2024"
)[
  - Architected and developed a *VS Code Web Extension* using TypeScript, GitHub actions and Webpack to create the Virtual Labs Authoring Environment, streamlining the entire creation workflow for over 1,000 students.
  - Drove the refinement of more than 10 product features by facilitating weekly client feedback sessions and fostering effective collaboration between technical and non-technical teams, delivering the project within a 70-day timeframe.
]

#item(
  "Web Administrator", "IT Office, IIIT Hyderabad", "Aug 2023 - Present"
)[
  - Ensured high availability and reliability for *university websites* serving over 1,000 daily users through proactive, real-time system health monitoring and streamlined deployment pipelines, enabling rapid incident diagnosis and resolution.
  - Diagnosed and resolved 20-50 technical issues per month, ranging from backend errors to performance bottlenecks, through systematic debugging minimizing downtime and maintaining service continuity for critical university web infrastructure.
]

// --- Projects ---
#section("Projects")

#project(
  "University Canteen Management", "Team Project | React js, FastAPI, GraphQL", 
  "https://github.com/Dileepadari/CanteenX", "https://smartcanteen.dileepadari.dev"
)[
  - Architected and built *CanteenX*, a scalable, full-stack web platform designed to support a complex ecosystem of multiple vendors, student accounts, and administrators to streamline food ordering and payments.
  - Constructed a modular backend with FastAPI and GraphQL that transformed the ordering process from a manual queue into an intuitive order-ahead system, eliminating the 20-30 minute on-site wait for hundreds of students.
]

#project(
  "Smart Crop/Plant Monitoring", "Team Project | Flask, ThingSpeak, OM2M",
  "https://github.com/Dileepadari/PlantIQ", "https://greenplant.dileepadari.dev"
)[
  - Developed *PlantIQ*, a sensor-driven monitoring system capable of detecting plant stress, water requirement and nutrient imbalances with 95% accuracy by analyzing real-time sensor streams to proactively alert farmers.
  - Designed and implemented a real-time monitoring dashboard with intelligent alerts to provide actionable insights through intuitive data visualizations and predictive trend analysis, enabling decision-making to prevent crop loss.
]

#project(
  "Network File System", "Team Project | C, Concurrency, Networking",
  "https://github.com/Dileepadari/NFSDrive", "https://github.com/Dileepadari/NFSDrive" // Using execution link
)[
  - Built a distributed, fault-tolerant *file system in C* from the ground up, implementing all networking and concurrency logic from scratch, utilizing TCP socket programming to ensure high data availability and consistency.
  - Created replication, synchronization, and recovery mechanisms that enabled seamless, automatic failover to healthy replicas to handle server failures, achieving near-zero downtime and ensuring data integrity under heavy network stress.
]

#grid(
  columns: (1fr, auto),
  text(weight: "bold")[Additional Projects], link("https://github.com/Dileepadari")[GitHub]
)
#v(3pt)
Tourism ToolKit • Smart Power Grid • Conference Booking API • Digital Library System • BlogNest • Finance Learning App • VoteArena • Trendify • ChatWrap • FaceBook Clone • Mess Inspection Tool • SplitMate • LifeBook • TimeTrack • Music Mania • PEC db • WebHunt • Enhanced Xv6 Shell • Mini Shell

// --- Technical Skills ---
#section("Technical Skills")
*Languages:* Python, C, C++, JavaScript, TypeScript, Bash, PHP \
*Frameworks:* FastAPI, Flask, React, Node.js, Next.js, Tailwind CSS \
*Clouds & Databases:* SQL, MongoDB, ThingSpeak, OM2M \
*Technologies:* Docker, PM2, Nginx, Apache, WordPress, Joomla! CMS \
*Developer Tools:* Git, Linux, phpMyAdmin, Postman, Arduino, VS Code

// --- Achievements ---
#section("Achievements & POR")
#set list(marker: [•])
- Achieved a peak rating of 1300 (Pupil) on *Codeforces*
- Selected for the *Google Summer of Code 2025* program
- Worked as a Teaching Assistant for the *Software Systems* course at IIIT Hyderabad
- Led community engagement initiatives as the *Head of Social Media* for NSS-IIITH