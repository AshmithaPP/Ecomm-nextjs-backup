"use client";

import React from "react";
import "./Mastersvoice.css";
import Image from "next/image";
import weaverPortrait from "assets/images/weaver_portrait.png";
import { IMAGE_BASE } from "@/config/api";

interface MastersvoiceProps {
  label?: string;
  quote?: string;
  name?: string;
  title?: string;
  body?: string;
  imageUrl?: string;
  badgeNumber?: string;
  badgeText?: string;
}

const Mastersvoice = ({
  label = "A Master's Voice",
  quote = "\"For me, the silk thread is not just material; it's a lifeline. Every knot I tie carries the wisdom of my grandfather and the hope of my grandson.\"",
  name = "Srinivasan Mudaliar",
  title = "Master Weaver of 42 Years",
  body = "Srinivasan is one of our 120 partner weavers. His expertise in the 'Aayiram Butta' (Thousand Buttas) pattern is legendary in Kanchipuram. By choosing Heritage Weaves, you ensure his legacy continues.",
  imageUrl,
  badgeNumber = "40+",
  badgeText = "Years of\nExpertise"
}: MastersvoiceProps) => {
  const resolvedImage = imageUrl
    ? ((imageUrl.startsWith('http') || imageUrl.startsWith('/_next/')) ? imageUrl : `${IMAGE_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`)
    : weaverPortrait.src;

  return (
    <section className="mastersvoice-section">
      <div className="mastersvoice-inner">

        {/* LEFT — Text Content */}
        <div className="mastersvoice-left">

          {/* Olive label */}
          <p className="mastersvoice-label">{label}</p>

          {/* Large maroon quote */}
          <blockquote className="mastersvoice-quote">
            {quote}
          </blockquote>

          {/* Weaver name */}
          <p className="mastersvoice-name">{name}</p>

          {/* Subtitle */}
          <p className="mastersvoice-title">{title}</p>

          {/* Thin rule */}
          <div className="mastersvoice-divider" aria-hidden="true" />

          {/* Body copy */}
          <p className="mastersvoice-body">
            {body}
          </p>

        </div>

        {/* RIGHT — Photo with red badge */}
        <div className="mastersvoice-right">
          <img
            src={resolvedImage}
            alt={`${name}, ${title}`}
            className="mastersvoice-photo"
          />

          {/* Red badge */}
          <div className="mastersvoice-badge" aria-label={`${badgeNumber} ${badgeText}`}>
            <p className="mastersvoice-badge-number">{badgeNumber}</p>
            <p className="mastersvoice-badge-text">
              {badgeText.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < badgeText.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Mastersvoice;
