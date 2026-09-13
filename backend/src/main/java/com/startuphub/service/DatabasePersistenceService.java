package com.startuphub.service;

import com.startuphub.entity.JobApplicationEntity;
import com.startuphub.entity.StartupEntity;
import com.startuphub.entity.MarketingCampaignEntity;
import com.startuphub.repository.JobApplicationRepository;
import com.startuphub.repository.StartupRepository;
import com.startuphub.repository.MarketingCampaignRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class DatabasePersistenceService {

    private final JobApplicationRepository jobApplicationRepository;
    private final StartupRepository startupRepository;
    private final MarketingCampaignRepository marketingCampaignRepository;

    public DatabasePersistenceService(
            JobApplicationRepository jobApplicationRepository,
            StartupRepository startupRepository,
            MarketingCampaignRepository marketingCampaignRepository
    ) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.startupRepository = startupRepository;
        this.marketingCampaignRepository = marketingCampaignRepository;
    }

    @PostConstruct
    @Transactional
    public void seedInitialDataIfEmpty() {
        // 1. Seed Global Startups if empty or missing global hubs
        if (startupRepository.count() < 5) {
            syncGlobalStartups();
        }

        // 2. Seed Job Applications if empty in persistent DB
        if (jobApplicationRepository.count() == 0) {
            JobApplicationEntity app1 = new JobApplicationEntity();
            app1.setId("app-501");
            app1.setStartupName("Quantum AI Labs");
            app1.setTitle("Lead AI Infrastructure Engineer");
            app1.setRoleType("FULL_TIME");
            app1.setAppliedDate("2026-09-04");
            app1.setStatus("INTERVIEW_SCHEDULED");
            app1.setAtsMatchScore(96);
            app1.setCompensation("$120k - $160k /yr");
            app1.setStageNote("Technical System Architecture Round with CTO. Scheduled for Wed, Sep 9 at 3:00 PM EST.");
            app1.setTechStack("Python, Spring Boot, pgvector, Docker");
            app1.setResumeUsed("Tailored_Resume_Lead_AI_Infrastructure.pdf");
            app1.setCoverNote("Architected distributed high-throughput microservices reducing query latency by 42% for 3.5M daily requests.");
            app1.setCandidateName("Alex Vance");
            app1.setCandidateEmail("alex.vance@startuphub.io");
            jobApplicationRepository.save(app1);

            JobApplicationEntity app2 = new JobApplicationEntity();
            app2.setId("app-502");
            app2.setStartupName("BioGenix Health");
            app2.setTitle("Full-Stack React & WebRTC Specialist");
            app2.setRoleType("FREELANCE");
            app2.setAppliedDate("2026-09-05");
            app2.setStatus("UNDER_REVIEW");
            app2.setAtsMatchScore(92);
            app2.setCompensation("$75 - $110 /hr");
            app2.setStageNote("Recruiting team currently reviewing candidate portfolio & WebRTC code samples.");
            app2.setTechStack("React, Tailwind CSS, WebRTC, WebSockets");
            app2.setResumeUsed("Tailored_Resume_React_WebRTC.pdf");
            app2.setCoverNote("Experienced in real-time video streaming pipelines, WebRTC signaling protocols, and responsive UI telemetry.");
            app2.setCandidateName("Alex Vance");
            app2.setCandidateEmail("alex.vance@startuphub.io");
            jobApplicationRepository.save(app2);

            JobApplicationEntity app3 = new JobApplicationEntity();
            app3.setId("app-503");
            app3.setStartupName("VerdeGrid Dynamics");
            app3.setTitle("Embedded Systems & Rust Firmware Developer");
            app3.setRoleType("CONTRACT");
            app3.setAppliedDate("2026-09-02");
            app3.setStatus("REJECTED");
            app3.setAtsMatchScore(68);
            app3.setCompensation("$90 - $130 /hr");
            app3.setStageNote("Automated screening filter: position required 5+ years of dedicated CAN Bus firmware driver experience.");
            app3.setTechStack("Rust, C++, Embedded Linux, CAN Bus");
            app3.setResumeUsed("Alex_Vance_Generalist_Resume.pdf");
            app3.setCoverNote("Looking to transition systems engineering experience to next-gen EV battery telemetry.");
            app3.setCandidateName("Alex Vance");
            app3.setCandidateEmail("alex.vance@startuphub.io");
            jobApplicationRepository.save(app3);

            JobApplicationEntity app4 = new JobApplicationEntity();
            app4.setId("app-504");
            app4.setStartupName("DevOpsForge Labs");
            app4.setTitle("Senior Kubernetes Site Reliability Engineer");
            app4.setRoleType("FULL_TIME");
            app4.setAppliedDate("2026-08-29");
            app4.setStatus("OFFER_RECEIVED");
            app4.setAtsMatchScore(98);
            app4.setCompensation("$155,000 /yr + 0.75% Equity");
            app4.setStageNote("Formal compensation offer extended! Package includes sign-on bonus & global remote stipend.");
            app4.setTechStack("Java 17, Spring Boot 3, Kafka, Kubernetes, Go");
            app4.setResumeUsed("Tailored_Resume_DevOps_SRE.pdf");
            app4.setCoverNote("Over 6 years managing distributed multi-region Kubernetes clusters with 99.999% uptime.");
            app4.setCandidateName("Alex Vance");
            app4.setCandidateEmail("alex.vance@startuphub.io");
            jobApplicationRepository.save(app4);
        }
    }

    @Transactional
    public List<StartupEntity> syncGlobalStartups() {
        List<StartupEntity> globalList = buildGlobalStartupDirectory();
        for (StartupEntity s : globalList) {
            startupRepository.save(s);
        }
        return startupRepository.findAllByOrderByCreatedAtDesc();
    }

    private List<StartupEntity> buildGlobalStartupDirectory() {
        List<StartupEntity> list = new ArrayList<>();

        // 1. Silicon Valley, USA (North America)
        StartupEntity s1 = new StartupEntity();
        s1.setId("e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55");
        s1.setName("Quantum AI Labs");
        s1.setTagline("Autonomous LLM Orchestration & Localized Vector Caching Engine");
        s1.setSector("AI/ML");
        s1.setStage("SEED");
        s1.setValuation("$8,500,000");
        s1.setArr("$420,000");
        s1.setArrGrowthPct("+185.5%");
        s1.setMrr("$35,000");
        s1.setTotalFunding("$1,200,000");
        s1.setFounder("Alex Vance");
        s1.setKycStatus("VERIFIED");
        s1.setRegion("NORTH_AMERICA");
        s1.setCity("San Francisco");
        s1.setCountry("United States");
        s1.setFlag("🇺🇸");
        s1.setEcosystemHub("Silicon Valley Hub");
        s1.setConnectionStatus("CONNECTED_ACTIVE");
        s1.setCrossBorderReady(true);
        s1.setOpenPositionsCount(5);
        s1.setActiveInvestorsCount(14);
        s1.setLogoUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80");
        s1.setDescription("Distributed agent orchestration engine reducing LLM query latency by 42% with localized pgvector caching.");
        s1.setStakeholdersJson("[{\"name\":\"Alex Vance\",\"role\":\"Founder & CEO\",\"type\":\"FOUNDER\",\"share\":\"65%\"},{\"name\":\"Apex Capital\",\"role\":\"Lead Investor\",\"type\":\"INVESTOR\",\"share\":\"15%\"},{\"name\":\"Dr. Marcus Wei\",\"role\":\"Co-Founder & CTO\",\"type\":\"FOUNDER\",\"share\":\"15%\"},{\"name\":\"CloudScale Inc.\",\"role\":\"Cloud Partner\",\"type\":\"ENTERPRISE_PARTNER\",\"share\":\"5%\"}]");
        s1.setFundingLedgerJson("[{\"round\":\"Seed Round\",\"amount\":\"$1,200,000\",\"equity\":\"15.0%\",\"lead\":\"Apex Capital Partners\",\"date\":\"2026-01-15\"},{\"round\":\"Pre-Seed\",\"amount\":\"$300,000\",\"equity\":\"5.0%\",\"lead\":\"Angel Syndicate\",\"date\":\"2024-09-10\"}]");
        list.add(s1);

        // 2. Boston, USA (North America)
        StartupEntity s2 = new StartupEntity();
        s2.setId("b2eebc99-9c0b-4ef8-bb6d-6bb9bd380b22");
        s2.setName("ApexNeuro Robotics");
        s2.setTagline("Next-Gen Sub-Millimeter Micro-Surgical Autonomous Robotic Actuators");
        s2.setSector("Robotics & HealthTech");
        s2.setStage("SERIES_A");
        s2.setValuation("$18,000,000");
        s2.setArr("$980,000");
        s2.setArrGrowthPct("+245.0%");
        s2.setMrr("$82,000");
        s2.setTotalFunding("$4,500,000");
        s2.setFounder("Dr. Sarah Lin");
        s2.setKycStatus("VERIFIED");
        s2.setRegion("NORTH_AMERICA");
        s2.setCity("Boston");
        s2.setCountry("United States");
        s2.setFlag("🇺🇸");
        s2.setEcosystemHub("Kendall Square BioTech Cluster");
        s2.setConnectionStatus("CONNECTED_ACTIVE");
        s2.setCrossBorderReady(true);
        s2.setOpenPositionsCount(6);
        s2.setActiveInvestorsCount(9);
        s2.setLogoUrl("https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80");
        s2.setDescription("Haptic feedback AI micro-robotics operating inside neurovascular cavities with 99.98% surgical precision.");
        s2.setStakeholdersJson("[{\"name\":\"Dr. Sarah Lin\",\"role\":\"Founder & Chief Roboticist\",\"type\":\"FOUNDER\",\"share\":\"55%\"},{\"name\":\"Kendall Biotech Capital\",\"role\":\"Lead Investor\",\"type\":\"INVESTOR\",\"share\":\"25%\"},{\"name\":\"MIT Innovation Fund\",\"role\":\"Seed Investor\",\"type\":\"INVESTOR\",\"share\":\"20%\"}]");
        s2.setFundingLedgerJson("[{\"round\":\"Series A\",\"amount\":\"$4,500,000\",\"equity\":\"25.0%\",\"lead\":\"Kendall Biotech Capital\",\"date\":\"2026-02-18\"}]");
        list.add(s2);

        // 3. New York, USA (North America)
        StartupEntity s3 = new StartupEntity();
        s3.setId("c3eebc99-9c0b-4ef8-bb6d-6bb9bd380c33");
        s3.setName("FinFlow Global");
        s3.setTagline("Instant Cross-Border Multi-Currency Liquidity & Settlement Infrastructure");
        s3.setSector("FinTech");
        s3.setStage("SERIES_B");
        s3.setValuation("$28,000,000");
        s3.setArr("$2,850,000");
        s3.setArrGrowthPct("+310.0%");
        s3.setMrr("$238,000");
        s3.setTotalFunding("$8,000,000");
        s3.setFounder("Jonathan Hayes");
        s3.setKycStatus("VERIFIED");
        s3.setRegion("NORTH_AMERICA");
        s3.setCity("New York");
        s3.setCountry("United States");
        s3.setFlag("🇺🇸");
        s3.setEcosystemHub("Silicon Alley FinTech");
        s3.setConnectionStatus("CONNECTED_ACTIVE");
        s3.setCrossBorderReady(true);
        s3.setOpenPositionsCount(8);
        s3.setActiveInvestorsCount(18);
        s3.setLogoUrl("https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80");
        s3.setDescription("Algorithmic multi-rail forex liquidity routing between US, EU, and APAC banking networks in sub-100ms.");
        s3.setStakeholdersJson("[{\"name\":\"Jonathan Hayes\",\"role\":\"Founder & CEO\",\"type\":\"FOUNDER\",\"share\":\"48%\"},{\"name\":\"WallStreet Ventures\",\"role\":\"Lead Investor\",\"type\":\"INVESTOR\",\"share\":\"32%\"},{\"name\":\"Global Fin Corp\",\"role\":\"Strategic Backer\",\"type\":\"ENTERPRISE_PARTNER\",\"share\":\"20%\"}]");
        s3.setFundingLedgerJson("[{\"round\":\"Series B\",\"amount\":\"$8,000,000\",\"equity\":\"28.0%\",\"lead\":\"WallStreet Ventures\",\"date\":\"2025-10-12\"}]");
        list.add(s3);

        // 4. London, UK (Europe)
        StartupEntity s4 = new StartupEntity();
        s4.setId("f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66");
        s4.setName("BioGenix Health");
        s4.setTagline("Real-Time WebRTC Multidisciplinary Oncology Telemetry Platform");
        s4.setSector("HealthTech");
        s4.setStage("PRE_SEED");
        s4.setValuation("$6,000,000");
        s4.setArr("$222,000");
        s4.setArrGrowthPct("+210.0%");
        s4.setMrr("$18,500");
        s4.setTotalFunding("$450,000");
        s4.setFounder("Dr. Elena Rostova");
        s4.setKycStatus("VERIFIED");
        s4.setRegion("EUROPE");
        s4.setCity("London");
        s4.setCountry("United Kingdom");
        s4.setFlag("🇬🇧");
        s4.setEcosystemHub("Silicon Roundabout (Old Street)");
        s4.setConnectionStatus("CONNECTED_ACTIVE");
        s4.setCrossBorderReady(true);
        s4.setOpenPositionsCount(3);
        s4.setActiveInvestorsCount(7);
        s4.setLogoUrl("https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=150&auto=format&fit=crop&q=80");
        s4.setDescription("Real-time WebRTC multidisciplinary cancer board telemetry cutting treatment plan coordination time by 65%.");
        s4.setStakeholdersJson("[{\"name\":\"Dr. Elena Rostova\",\"role\":\"Founder & Lead Scientist\",\"type\":\"FOUNDER\",\"share\":\"80%\"},{\"name\":\"BioVentures Fund\",\"role\":\"Pre-Seed Lead\",\"type\":\"INVESTOR\",\"share\":\"20%\"}]");
        s4.setFundingLedgerJson("[{\"round\":\"Pre-Seed\",\"amount\":\"$450,000\",\"equity\":\"20.0%\",\"lead\":\"BioVentures Fund\",\"date\":\"2025-11-20\"}]");
        list.add(s4);

        // 5. Berlin, Germany (Europe)
        StartupEntity s5 = new StartupEntity();
        s5.setId("d5eebc99-9c0b-4ef8-bb6d-6bb9bd380d55");
        s5.setName("EcoMobility GmbH");
        s5.setTagline("Decentralized V2G Vehicle-to-Grid Smart Charging Mesh Networks");
        s5.setSector("CleanTech");
        s5.setStage("SERIES_A");
        s5.setValuation("$16,000,000");
        s5.setArr("$1,120,000");
        s5.setArrGrowthPct("+280.0%");
        s5.setMrr("$93,000");
        s5.setTotalFunding("$3,800,000");
        s5.setFounder("Max Weber");
        s5.setKycStatus("VERIFIED");
        s5.setRegion("EUROPE");
        s5.setCity("Berlin");
        s5.setCountry("Germany");
        s5.setFlag("🇩🇪");
        s5.setEcosystemHub("Berlin Silicon Allee");
        s5.setConnectionStatus("CONNECTED_ACTIVE");
        s5.setCrossBorderReady(true);
        s5.setOpenPositionsCount(4);
        s5.setActiveInvestorsCount(11);
        s5.setLogoUrl("https://images.unsplash.com/photo-1558441719-aa34bbe5f34d?w=150&auto=format&fit=crop&q=80");
        s5.setDescription("Peer-to-peer bidirectional EV charging balancing municipal power grids during peak European energy demand.");
        s5.setStakeholdersJson("[{\"name\":\"Max Weber\",\"role\":\"Founder & Managing Director\",\"type\":\"FOUNDER\",\"share\":\"60%\"},{\"name\":\"CleanEnergy Europe\",\"role\":\"Series A Lead\",\"type\":\"INVESTOR\",\"share\":\"25%\"},{\"name\":\"Berlin Seed Club\",\"role\":\"Early Angel\",\"type\":\"INVESTOR\",\"share\":\"15%\"}]");
        s5.setFundingLedgerJson("[{\"round\":\"Series A\",\"amount\":\"$3,800,000\",\"equity\":\"25.0%\",\"lead\":\"CleanEnergy Europe\",\"date\":\"2026-01-22\"}]");
        list.add(s5);

        // 6. Paris, France (Europe)
        StartupEntity s6 = new StartupEntity();
        s6.setId("e6eebc99-9c0b-4ef8-bb6d-6bb9bd380e66");
        s6.setName("BioSoma Therapeutics");
        s6.setTagline("Generative Protein Folding Foundation Models for Rapid Drug Formulation");
        s6.setSector("BioTech & AI");
        s6.setStage("SERIES_A");
        s6.setValuation("$24,000,000");
        s6.setArr("$1,650,000");
        s6.setArrGrowthPct("+320.0%");
        s6.setMrr("$138,000");
        s6.setTotalFunding("$6,200,000");
        s6.setFounder("Dr. Camille Laurent");
        s6.setKycStatus("VERIFIED");
        s6.setRegion("EUROPE");
        s6.setCity("Paris");
        s6.setCountry("France");
        s6.setFlag("🇫🇷");
        s6.setEcosystemHub("Station F (Paris Tech Campus)");
        s6.setConnectionStatus("CONNECTED_ACTIVE");
        s6.setCrossBorderReady(true);
        s6.setOpenPositionsCount(7);
        s6.setActiveInvestorsCount(15);
        s6.setLogoUrl("https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=150&auto=format&fit=crop&q=80");
        s6.setDescription("Diffusion-based macro-molecular binding simulation identifying novel kinase inhibitors in under 48 hours.");
        s6.setStakeholdersJson("[{\"name\":\"Dr. Camille Laurent\",\"role\":\"Founder & Chief Scientist\",\"type\":\"FOUNDER\",\"share\":\"52%\"},{\"name\":\"Paris DeepTech Fund\",\"role\":\"Lead Series A\",\"type\":\"INVESTOR\",\"share\":\"30%\"},{\"name\":\"Bpifrance Ventures\",\"role\":\"Co-Investor\",\"type\":\"INVESTOR\",\"share\":\"18%\"}]");
        s6.setFundingLedgerJson("[{\"round\":\"Series A\",\"amount\":\"$6,200,000\",\"equity\":\"30.0%\",\"lead\":\"Paris DeepTech Fund\",\"date\":\"2026-02-05\"}]");
        list.add(s6);

        // 7. Bengaluru, India (Asia-Pacific) - DevOpsForge Labs (Hiring 9 Roles)
        StartupEntity s7 = new StartupEntity();
        s7.setId("b7eebc99-9c0b-4ef8-bb6d-6bb9bd380b77");
        s7.setName("DevOpsForge Labs");
        s7.setTagline("Autonomous Multi-Cloud Kubernetes Self-Healing & SRE AI Agents");
        s7.setSector("DevOps & Cloud");
        s7.setStage("SEED");
        s7.setValuation("$15,000,000");
        s7.setArr("$920,000");
        s7.setArrGrowthPct("+290.0%");
        s7.setMrr("$76,500");
        s7.setTotalFunding("$2,800,000");
        s7.setFounder("Rohan Deshmukh");
        s7.setKycStatus("VERIFIED");
        s7.setRegion("ASIA_PACIFIC");
        s7.setCity("Bengaluru");
        s7.setCountry("India");
        s7.setFlag("🇮🇳");
        s7.setEcosystemHub("Koramangala Silicon Tech Hub");
        s7.setConnectionStatus("CONNECTED_ACTIVE");
        s7.setCrossBorderReady(true);
        s7.setOpenPositionsCount(9);
        s7.setActiveInvestorsCount(12);
        s7.setLogoUrl("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80");
        s7.setDescription("Zero-touch SRE copilots remediating Kubernetes cluster failovers and memory leaks automatically with eBPF hooks. Actively hiring Senior SREs and Go distributed engineers.");
        s7.setStakeholdersJson("[{\"name\":\"Rohan Deshmukh\",\"role\":\"Founder & CEO\",\"type\":\"FOUNDER\",\"share\":\"62%\"},{\"name\":\"PeakXV Ventures India\",\"role\":\"Seed Lead\",\"type\":\"INVESTOR\",\"share\":\"22%\"},{\"name\":\"Bengaluru Angels\",\"role\":\"Angel Syndicate\",\"type\":\"INVESTOR\",\"share\":\"16%\"}]");
        s7.setFundingLedgerJson("[{\"round\":\"Seed Round\",\"amount\":\"$2,800,000\",\"equity\":\"22.0%\",\"lead\":\"PeakXV Ventures India\",\"date\":\"2026-01-30\"}]");
        list.add(s7);

        // 7b. Bengaluru / Pune, India - KisanSetu AI (Hiring 6 Roles)
        StartupEntity s7b = new StartupEntity();
        s7b.setId("in-ks-7b0b-4ef8-bb6d-6bb9bd380in1");
        s7b.setName("KisanSetu AI");
        s7b.setTagline("Satellite Computer Vision & Edge AI for Precision Crop Yield Optimization");
        s7b.setSector("AgriTech & AI");
        s7b.setStage("SEED");
        s7b.setValuation("$12,000,000");
        s7b.setArr("$680,000");
        s7b.setArrGrowthPct("+325.0%");
        s7b.setMrr("$56,000");
        s7b.setTotalFunding("$2,200,000");
        s7b.setFounder("Pooja Kulkarni & Aditya Verma");
        s7b.setKycStatus("VERIFIED");
        s7b.setRegion("ASIA_PACIFIC");
        s7b.setCity("Bengaluru");
        s7b.setCountry("India");
        s7b.setFlag("🇮🇳");
        s7b.setEcosystemHub("Indiranagar DeepTech Hub");
        s7b.setConnectionStatus("CONNECTED_ACTIVE");
        s7b.setCrossBorderReady(true);
        s7b.setOpenPositionsCount(6);
        s7b.setActiveInvestorsCount(8);
        s7b.setLogoUrl("https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=150&auto=format&fit=crop&q=80");
        s7b.setDescription("High-resolution multispectral crop pathology models on drone edge computing. Actively hiring Computer Vision Scientists (₹35L-₹55L) and React Data Platform Engineers.");
        s7b.setStakeholdersJson("[{\"name\":\"Pooja Kulkarni\",\"role\":\"Co-Founder & CEO\",\"type\":\"FOUNDER\",\"share\":\"45%\"},{\"name\":\"Aditya Verma\",\"role\":\"Co-Founder & CTO\",\"type\":\"FOUNDER\",\"share\":\"35%\"},{\"name\":\"Omnivore Agri Fund\",\"role\":\"Seed Lead\",\"type\":\"INVESTOR\",\"share\":\"20%\"}]");
        s7b.setFundingLedgerJson("[{\"round\":\"Seed Round\",\"amount\":\"$2,200,000\",\"equity\":\"20.0%\",\"lead\":\"Omnivore Agri Fund\",\"date\":\"2026-02-10\"}]");
        list.add(s7b);

        // 7c. Bengaluru - IndusHealth Diagnostics (Hiring 8 Roles)
        StartupEntity s7c = new StartupEntity();
        s7c.setId("in-ih-7c0b-4ef8-bb6d-6bb9bd380in2");
        s7c.setName("IndusHealth Diagnostics");
        s7c.setTagline("Deep Learning Point-of-Care Pathology Diagnostics for Tier-2/3 India");
        s7c.setSector("HealthTech & AI");
        s7c.setStage("SERIES_A");
        s7c.setValuation("$21,000,000");
        s7c.setArr("$1,850,000");
        s7c.setArrGrowthPct("+360.0%");
        s7c.setMrr("$154,000");
        s7c.setTotalFunding("$5,500,000");
        s7c.setFounder("Dr. Ananya Sharma");
        s7c.setKycStatus("VERIFIED");
        s7c.setRegion("ASIA_PACIFIC");
        s7c.setCity("Bengaluru");
        s7c.setCountry("India");
        s7c.setFlag("🇮🇳");
        s7c.setEcosystemHub("HSR Layout BioTech Corridor");
        s7c.setConnectionStatus("CONNECTED_ACTIVE");
        s7c.setCrossBorderReady(true);
        s7c.setOpenPositionsCount(8);
        s7c.setActiveInvestorsCount(11);
        s7c.setLogoUrl("https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=150&auto=format&fit=crop&q=80");
        s7c.setDescription("Sub-second AI blood smear telemetry delivering pathology results in rural clinics. Actively hiring Deep Learning Image Scientists (₹40L-₹60L) and Mobile Flutter Leads.");
        s7c.setStakeholdersJson("[{\"name\":\"Dr. Ananya Sharma\",\"role\":\"Founder & Chief Medical Officer\",\"type\":\"FOUNDER\",\"share\":\"58%\"},{\"name\":\"Matrix Partners India\",\"role\":\"Series A Lead\",\"type\":\"INVESTOR\",\"share\":\"28%\"},{\"name\":\"HealthX Angels\",\"role\":\"Early Angels\",\"type\":\"INVESTOR\",\"share\":\"14%\"}]");
        s7c.setFundingLedgerJson("[{\"round\":\"Series A\",\"amount\":\"$5,500,000\",\"equity\":\"28.0%\",\"lead\":\"Matrix Partners India\",\"date\":\"2026-01-18\"}]");
        list.add(s7c);

        // 7d. Bengaluru / Mumbai - SarvPay Payments (Hiring 11 Roles)
        StartupEntity s7d = new StartupEntity();
        s7d.setId("in-sp-7d0b-4ef8-bb6d-6bb9bd380in3");
        s7d.setName("SarvPay Payments");
        s7d.setTagline("Next-Gen UPI 2.0 Real-Time High-Throughput Settlement Engine");
        s7d.setSector("FinTech");
        s7d.setStage("SERIES_B");
        s7d.setValuation("$38,000,000");
        s7d.setArr("$3,600,000");
        s7d.setArrGrowthPct("+410.0%");
        s7d.setMrr("$300,000");
        s7d.setTotalFunding("$12,000,000");
        s7d.setFounder("Vikram Mehra");
        s7d.setKycStatus("VERIFIED");
        s7d.setRegion("ASIA_PACIFIC");
        s7d.setCity("Mumbai");
        s7d.setCountry("India");
        s7d.setFlag("🇮🇳");
        s7d.setEcosystemHub("BKC FinTech District");
        s7d.setConnectionStatus("CONNECTED_ACTIVE");
        s7d.setCrossBorderReady(true);
        s7d.setOpenPositionsCount(11);
        s7d.setActiveInvestorsCount(15);
        s7d.setLogoUrl("https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80");
        s7d.setDescription("Processing 18M daily merchant micro-settlements across India with 99.999% availability. Actively hiring Java 17/Kafka Architects (₹45L-₹70L) and Cryptography Leads.");
        s7d.setStakeholdersJson("[{\"name\":\"Vikram Mehra\",\"role\":\"Founder & CEO\",\"type\":\"FOUNDER\",\"share\":\"44%\"},{\"name\":\"Sequoia Surge / PeakXV\",\"role\":\"Series B Lead\",\"type\":\"INVESTOR\",\"share\":\"36%\"},{\"name\":\"Fintech India Syndicate\",\"role\":\"Co-Investors\",\"type\":\"INVESTOR\",\"share\":\"20%\"}]");
        s7d.setFundingLedgerJson("[{\"round\":\"Series B\",\"amount\":\"$12,000,000\",\"equity\":\"36.0%\",\"lead\":\"Sequoia Surge / PeakXV\",\"date\":\"2026-02-28\"}]");
        list.add(s7d);

        // 7e. Hyderabad / Pune - UrbanFleet Mobility (Hiring 7 Roles)
        StartupEntity s7e = new StartupEntity();
        s7e.setId("in-uf-7e0b-4ef8-bb6d-6bb9bd380in4");
        s7e.setName("UrbanFleet Mobility");
        s7e.setTagline("Smart EV 2-Wheeler Fleet Swapping & BMS Telemetry Platform");
        s7e.setSector("CleanTech & EV");
        s7e.setStage("SERIES_A");
        s7e.setValuation("$17,500,000");
        s7e.setArr("$1,280,000");
        s7e.setArrGrowthPct("+310.0%");
        s7e.setMrr("$106,000");
        s7e.setTotalFunding("$4,800,000");
        s7e.setFounder("Suresh Nambiar & Karthik Rao");
        s7e.setKycStatus("VERIFIED");
        s7e.setRegion("ASIA_PACIFIC");
        s7e.setCity("Hyderabad");
        s7e.setCountry("India");
        s7e.setFlag("🇮🇳");
        s7e.setEcosystemHub("HITEC City Tech Hub");
        s7e.setConnectionStatus("CONNECTED_ACTIVE");
        s7e.setCrossBorderReady(true);
        s7e.setOpenPositionsCount(7);
        s7e.setActiveInvestorsCount(9);
        s7e.setLogoUrl("https://images.unsplash.com/photo-1558441719-aa34bbe5f34d?w=150&auto=format&fit=crop&q=80");
        s7e.setDescription("Telemetry cloud for 35,000 commercial EV delivery bikes across Indian metros. Actively hiring Embedded Rust BMS Engineers (₹30L-₹48L) and React Native Developers.");
        s7e.setStakeholdersJson("[{\"name\":\"Suresh Nambiar\",\"role\":\"Co-Founder & CEO\",\"type\":\"FOUNDER\",\"share\":\"42%\"},{\"name\":\"Karthik Rao\",\"role\":\"Co-Founder & CTO\",\"type\":\"FOUNDER\",\"share\":\"38%\"},{\"name\":\"CleanMobility India\",\"role\":\"Series A Lead\",\"type\":\"INVESTOR\",\"share\":\"20%\"}]");
        s7e.setFundingLedgerJson("[{\"round\":\"Series A\",\"amount\":\"$4,800,000\",\"equity\":\"20.0%\",\"lead\":\"CleanMobility India\",\"date\":\"2026-01-25\"}]");
        list.add(s7e);

        // 7f. Delhi-NCR / Gurugram - VaidyaGen AI (Hiring 5 Roles)
        StartupEntity s7f = new StartupEntity();
        s7f.setId("in-vg-7f0b-4ef8-bb6d-6bb9bd380in5");
        s7f.setName("VaidyaGen AI");
        s7f.setTagline("Clinical GenAI & Multilingual Medical Co-pilot for Indian Doctors");
        s7f.setSector("HealthTech & AI");
        s7f.setStage("SEED");
        s7f.setValuation("$11,500,000");
        s7f.setArr("$590,000");
        s7f.setArrGrowthPct("+275.0%");
        s7f.setMrr("$49,000");
        s7f.setTotalFunding("$2,000,000");
        s7f.setFounder("Dr. Tarun Saxena");
        s7f.setKycStatus("VERIFIED");
        s7f.setRegion("ASIA_PACIFIC");
        s7f.setCity("Delhi-NCR");
        s7f.setCountry("India");
        s7f.setFlag("🇮🇳");
        s7f.setEcosystemHub("Cyber City Gurugram");
        s7f.setConnectionStatus("CONNECTED_ACTIVE");
        s7f.setCrossBorderReady(true);
        s7f.setOpenPositionsCount(5);
        s7f.setActiveInvestorsCount(7);
        s7f.setLogoUrl("https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=150&auto=format&fit=crop&q=80");
        s7f.setDescription("Speech-to-prescription and EHR summaries supporting 12 Indian regional languages. Actively hiring LLM Fine-Tuning Researchers (₹38L-₹58L) and MLOps Engineers.");
        s7f.setStakeholdersJson("[{\"name\":\"Dr. Tarun Saxena\",\"role\":\"Founder & CEO\",\"type\":\"FOUNDER\",\"share\":\"60%\"},{\"name\":\"Kalaari Capital\",\"role\":\"Seed Lead\",\"type\":\"INVESTOR\",\"share\":\"25%\"},{\"name\":\"Angel Syndicate\",\"role\":\"Angels\",\"type\":\"INVESTOR\",\"share\":\"15%\"}]");
        s7f.setFundingLedgerJson("[{\"round\":\"Seed Round\",\"amount\":\"$2,000,000\",\"equity\":\"25.0%\",\"lead\":\"Kalaari Capital\",\"date\":\"2026-02-02\"}]");
        list.add(s7f);

        // 7g. Bengaluru / Hyderabad - ChakraShield Cyber (Hiring 6 Roles)
        StartupEntity s7g = new StartupEntity();
        s7g.setId("in-cs-7g0b-4ef8-bb6d-6bb9bd380in6");
        s7g.setName("ChakraShield Cyber");
        s7g.setTagline("Kernel-Space eBPF Cloud Defense & Data Residency Compliance Suite");
        s7g.setSector("CyberSecurity");
        s7g.setStage("SEED");
        s7g.setValuation("$14,000,000");
        s7g.setArr("$780,000");
        s7g.setArrGrowthPct("+340.0%");
        s7g.setMrr("$65,000");
        s7g.setTotalFunding("$2,600,000");
        s7g.setFounder("Deepak Krishnan");
        s7g.setKycStatus("VERIFIED");
        s7g.setRegion("ASIA_PACIFIC");
        s7g.setCity("Bengaluru");
        s7g.setCountry("India");
        s7g.setFlag("🇮🇳");
        s7g.setEcosystemHub("Whitefield Cyber Hub");
        s7g.setConnectionStatus("CONNECTED_ACTIVE");
        s7g.setCrossBorderReady(true);
        s7g.setOpenPositionsCount(6);
        s7g.setActiveInvestorsCount(9);
        s7g.setLogoUrl("https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=80");
        s7g.setDescription("Protecting BFSI and digital payment rails under India DPDP compliance regulations. Actively hiring Kernel eBPF Engineers (₹36L-₹54L) and DevSecOps Leads.");
        s7g.setStakeholdersJson("[{\"name\":\"Deepak Krishnan\",\"role\":\"Founder & CTO\",\"type\":\"FOUNDER\",\"share\":\"55%\"},{\"name\":\"Blume Ventures\",\"role\":\"Seed Lead\",\"type\":\"INVESTOR\",\"share\":\"25%\"},{\"name\":\"Cyber Angels India\",\"role\":\"Angels\",\"type\":\"INVESTOR\",\"share\":\"20%\"}]");
        s7g.setFundingLedgerJson("[{\"round\":\"Seed Round\",\"amount\":\"$2,600,000\",\"equity\":\"25.0%\",\"lead\":\"Blume Ventures\",\"date\":\"2026-01-12\"}]");
        list.add(s7g);

        // 8. Singapore (Asia-Pacific)
        StartupEntity s8 = new StartupEntity();
        s8.setId("s8eebc99-9c0b-4ef8-bb6d-6bb9bd380s88");
        s8.setName("NauticalChain");
        s8.setTagline("Autonomous Maritime Freight Bill of Lading & Smart Customs Clearing");
        s8.setSector("SupplyChain & Web3");
        s8.setStage("SERIES_A");
        s8.setValuation("$19,000,000");
        s8.setArr("$1,380,000");
        s8.setArrGrowthPct("+215.0%");
        s8.setMrr("$115,000");
        s8.setTotalFunding("$4,200,000");
        s8.setFounder("Kevin Tan");
        s8.setKycStatus("VERIFIED");
        s8.setRegion("ASIA_PACIFIC");
        s8.setCity("Singapore");
        s8.setCountry("Singapore");
        s8.setFlag("🇸🇬");
        s8.setEcosystemHub("Block71 Singapore Innovation Ecosystem");
        s8.setConnectionStatus("CONNECTED_ACTIVE");
        s8.setCrossBorderReady(true);
        s8.setOpenPositionsCount(5);
        s8.setActiveInvestorsCount(10);
        s8.setLogoUrl("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80");
        s8.setDescription("Decentralized shipping manifests eliminating paper-based port customs delays across the Strait of Malacca.");
        s8.setStakeholdersJson("[{\"name\":\"Kevin Tan\",\"role\":\"Founder & Managing Director\",\"type\":\"FOUNDER\",\"share\":\"58%\"},{\"name\":\"Temasek-backed Fund\",\"role\":\"Series A Lead\",\"type\":\"INVESTOR\",\"share\":\"24%\"},{\"name\":\"SG Maritime Angels\",\"role\":\"Early Angels\",\"type\":\"INVESTOR\",\"share\":\"18%\"}]");
        s8.setFundingLedgerJson("[{\"round\":\"Series A\",\"amount\":\"$4,200,000\",\"equity\":\"24.0%\",\"lead\":\"Temasek-backed Fund\",\"date\":\"2025-12-08\"}]");
        list.add(s8);

        // 9. Tokyo, Japan (Asia-Pacific)
        StartupEntity s9 = new StartupEntity();
        s9.setId("t9eebc99-9c0b-4ef8-bb6d-6bb9bd380t99");
        s9.setName("RoboKinetic Systems");
        s9.setTagline("High-Speed Computer Vision Edge Controllers for Precision Semiconductor Fab");
        s9.setSector("Hardware & Robotics");
        s9.setStage("SERIES_B");
        s9.setValuation("$32,000,000");
        s9.setArr("$3,100,000");
        s9.setArrGrowthPct("+265.0%");
        s9.setMrr("$258,000");
        s9.setTotalFunding("$10,500,000");
        s9.setFounder("Kenji Takahashi");
        s9.setKycStatus("VERIFIED");
        s9.setRegion("ASIA_PACIFIC");
        s9.setCity("Tokyo");
        s9.setCountry("Japan");
        s9.setFlag("🇯🇵");
        s9.setEcosystemHub("Shibuya Bit Valley");
        s9.setConnectionStatus("CONNECTED_ACTIVE");
        s9.setCrossBorderReady(true);
        s9.setOpenPositionsCount(8);
        s9.setActiveInvestorsCount(16);
        s9.setLogoUrl("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&auto=format&fit=crop&q=80");
        s9.setDescription("Sub-nanometer optical wafer defect detection running on on-prem FPGA inference boards at 1,000 fps.");
        s9.setStakeholdersJson("[{\"name\":\"Kenji Takahashi\",\"role\":\"Founder & President\",\"type\":\"FOUNDER\",\"share\":\"45%\"},{\"name\":\"Tokyo DeepTech Partners\",\"role\":\"Lead Series B\",\"type\":\"INVESTOR\",\"share\":\"35%\"},{\"name\":\"Japan Innovation Fund\",\"role\":\"Co-Investor\",\"type\":\"INVESTOR\",\"share\":\"20%\"}]");
        s9.setFundingLedgerJson("[{\"round\":\"Series B\",\"amount\":\"$10,500,000\",\"equity\":\"32.0%\",\"lead\":\"Tokyo DeepTech Partners\",\"date\":\"2026-02-14\"}]");
        list.add(s9);

        // 10. Tel Aviv, Israel (Middle East)
        StartupEntity s10 = new StartupEntity();
        s10.setId("i10ebc99-9c0b-4ef8-bb6d-6bb9bd380i10");
        s10.setName("CyberShield Vault");
        s10.setTagline("Zero-Trust Memory-Level Exploit Immunization & Runtime Defense");
        s10.setSector("CyberSecurity");
        s10.setStage("SERIES_A");
        s10.setValuation("$26,000,000");
        s10.setArr("$2,100,000");
        s10.setArrGrowthPct("+380.0%");
        s10.setMrr("$175,000");
        s10.setTotalFunding("$6,000,000");
        s10.setFounder("Ariel Cohen");
        s10.setKycStatus("VERIFIED");
        s10.setRegion("MIDDLE_EAST");
        s10.setCity("Tel Aviv");
        s10.setCountry("Israel");
        s10.setFlag("🇮🇱");
        s10.setEcosystemHub("Silicon Wadi Cyber Corridor");
        s10.setConnectionStatus("CONNECTED_ACTIVE");
        s10.setCrossBorderReady(true);
        s10.setOpenPositionsCount(6);
        s10.setActiveInvestorsCount(14);
        s10.setLogoUrl("https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=80");
        s10.setDescription("Kernel-space runtime defense neutralizing zero-day memory corruption before instructions hit CPU execution.");
        s10.setStakeholdersJson("[{\"name\":\"Ariel Cohen\",\"role\":\"Founder & CTO\",\"type\":\"FOUNDER\",\"share\":\"50%\"},{\"name\":\"Tel Aviv Cyber Ventures\",\"role\":\"Lead Series A\",\"type\":\"INVESTOR\",\"share\":\"30%\"},{\"name\":\"CyberShield Angels\",\"role\":\"Early Backers\",\"type\":\"INVESTOR\",\"share\":\"20%\"}]");
        s10.setFundingLedgerJson("[{\"round\":\"Series A\",\"amount\":\"$6,000,000\",\"equity\":\"30.0%\",\"lead\":\"Tel Aviv Cyber Ventures\",\"date\":\"2026-01-08\"}]");
        list.add(s10);

        // 11. São Paulo, Brazil (Latin America)
        StartupEntity s11 = new StartupEntity();
        s11.setId("p11ebc99-9c0b-4ef8-bb6d-6bb9bd380p11");
        s11.setName("PixPix Pay");
        s11.setTagline("Embedded Instant Credit Scoring & Micro-Payments for LatAm SMBs");
        s11.setSector("FinTech");
        s11.setStage("SEED");
        s11.setValuation("$13,500,000");
        s11.setArr("$840,000");
        s11.setArrGrowthPct("+315.0%");
        s11.setMrr("$70,000");
        s11.setTotalFunding("$2,500,000");
        s11.setFounder("Gabriela Santos");
        s11.setKycStatus("VERIFIED");
        s11.setRegion("LATAM_AFRICA");
        s11.setCity("São Paulo");
        s11.setCountry("Brazil");
        s11.setFlag("🇧🇷");
        s11.setEcosystemHub("Faria Lima Innovation District");
        s11.setConnectionStatus("CONNECTED_ACTIVE");
        s11.setCrossBorderReady(true);
        s11.setOpenPositionsCount(4);
        s11.setActiveInvestorsCount(8);
        s11.setLogoUrl("https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=150&auto=format&fit=crop&q=80");
        s11.setDescription("Alternative credit scoring based on WhatsApp commerce invoice receipts powering 45,000 Brazilian merchants.");
        s11.setStakeholdersJson("[{\"name\":\"Gabriela Santos\",\"role\":\"Founder & CEO\",\"type\":\"FOUNDER\",\"share\":\"64%\"},{\"name\":\"Monashees LatAm Fund\",\"role\":\"Lead Seed\",\"type\":\"INVESTOR\",\"share\":\"20%\"},{\"name\":\"Brazil Fintech Angels\",\"role\":\"Angels\",\"type\":\"INVESTOR\",\"share\":\"16%\"}]");
        s11.setFundingLedgerJson("[{\"round\":\"Seed Round\",\"amount\":\"$2,500,000\",\"equity\":\"20.0%\",\"lead\":\"Monashees LatAm Fund\",\"date\":\"2025-11-15\"}]");
        list.add(s11);

        // 12. Global Remote (Distributed)
        StartupEntity s12 = new StartupEntity();
        s12.setId("g6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77");
        s12.setName("VerdeGrid Dynamics");
        s12.setTagline("Sub-Millisecond CAN-Bus Firmware Balancing EV Fleet Energy Storage");
        s12.setSector("CleanTech");
        s12.setStage("SERIES_A");
        s12.setValuation("$22,000,000");
        s12.setArr("$1,440,000");
        s12.setArrGrowthPct("+340.0%");
        s12.setMrr("$120,000");
        s12.setTotalFunding("$5,000,000");
        s12.setFounder("Marcus Thorne");
        s12.setKycStatus("VERIFIED");
        s12.setRegion("GLOBAL_REMOTE");
        s12.setCity("Distributed Remote");
        s12.setCountry("Global Mesh");
        s12.setFlag("🌐");
        s12.setEcosystemHub("Global Decentralized Hub");
        s12.setConnectionStatus("CONNECTED_ACTIVE");
        s12.setCrossBorderReady(true);
        s12.setOpenPositionsCount(7);
        s12.setActiveInvestorsCount(13);
        s12.setLogoUrl("https://images.unsplash.com/photo-1509391365360-2e959784a276?w=150&auto=format&fit=crop&q=80");
        s12.setDescription("Sub-millisecond CAN-bus firmware telemetry balancing high-frequency EV battery storage degradation.");
        s12.setStakeholdersJson("[{\"name\":\"Marcus Thorne\",\"role\":\"Founder & CEO\",\"type\":\"FOUNDER\",\"share\":\"50%\"},{\"name\":\"GreenEnergy VC\",\"role\":\"Series A Lead\",\"type\":\"INVESTOR\",\"share\":\"30%\"},{\"name\":\"EcoTech Partners\",\"role\":\"Strategic Partner\",\"type\":\"ENTERPRISE_PARTNER\",\"share\":\"20%\"}]");
        s12.setFundingLedgerJson("[{\"round\":\"Series A\",\"amount\":\"$5,000,000\",\"equity\":\"30.0%\",\"lead\":\"GreenEnergy VC\",\"date\":\"2026-03-01\"}]");
        list.add(s12);

        return list;
    }

    // Job Application Persistence Methods
    public List<JobApplicationEntity> getAllApplications() {
        return jobApplicationRepository.findAllByOrderByCreatedAtDesc();
    }

    public JobApplicationEntity saveApplication(JobApplicationEntity app) {
        if (app.getId() == null || app.getId().isBlank()) {
            app.setId("app-" + UUID.randomUUID().toString().substring(0, 8));
        }
        return jobApplicationRepository.save(app);
    }

    public List<JobApplicationEntity> batchSaveApplications(List<JobApplicationEntity> apps) {
        for (JobApplicationEntity a : apps) {
            if (a.getId() == null || a.getId().isBlank()) {
                a.setId("app-" + UUID.randomUUID().toString().substring(0, 8));
            }
        }
        return jobApplicationRepository.saveAll(apps);
    }

    public void deleteApplication(String id) {
        jobApplicationRepository.deleteById(id);
    }

    public JobApplicationEntity updateApplicationStatus(String id, String status, String stageNote) {
        return jobApplicationRepository.findById(id).map(app -> {
            app.setStatus(status);
            if (stageNote != null) app.setStageNote(stageNote);
            return jobApplicationRepository.save(app);
        }).orElse(null);
    }

    // Startup Persistence Methods
    public List<StartupEntity> getAllStartups(String region, String sector) {
        if (region != null && !region.isBlank() && !region.equalsIgnoreCase("ALL")) {
            return startupRepository.findByRegionIgnoreCase(region);
        }
        if (sector != null && !sector.isBlank()) {
            return startupRepository.findBySectorIgnoreCase(sector);
        }
        return startupRepository.findAllByOrderByCreatedAtDesc();
    }

    public StartupEntity saveStartup(StartupEntity startup) {
        if (startup.getId() == null || startup.getId().isBlank()) {
            startup.setId(UUID.randomUUID().toString());
        }
        return startupRepository.save(startup);
    }

    public Map<String, Object> getGlobalEcosystemStats() {
        List<StartupEntity> all = startupRepository.findAll();
        Set<String> countries = new HashSet<>();
        Set<String> hubs = new HashSet<>();
        Set<String> founders = new HashSet<>();
        int totalPositions = 0;

        for (StartupEntity s : all) {
            if (s.getCountry() != null) countries.add(s.getCountry());
            if (s.getEcosystemHub() != null) hubs.add(s.getEcosystemHub());
            if (s.getFounder() != null) founders.add(s.getFounder());
            if (s.getOpenPositionsCount() != null) totalPositions += s.getOpenPositionsCount();
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalConnectedStartups", all.size());
        stats.put("totalCountries", countries.size());
        stats.put("totalHubs", hubs.size());
        stats.put("totalFounders", founders.size());
        stats.put("totalOpenPositions", totalPositions);
        stats.put("globalNetworkStatus", "LIVE_SYNCED_100%");
        return stats;
    }

    // Marketing Campaign Persistence Methods
    public List<MarketingCampaignEntity> getAllMarketingCampaigns() {
        return marketingCampaignRepository.findAllByOrderByCreatedAtDesc();
    }

    public MarketingCampaignEntity saveMarketingCampaign(MarketingCampaignEntity campaign) {
        if (campaign.getId() == null || campaign.getId().isBlank()) {
            campaign.setId("camp-" + UUID.randomUUID().toString().substring(0, 8));
        }
        return marketingCampaignRepository.save(campaign);
    }
}

