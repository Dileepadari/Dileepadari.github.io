/*
 * Archive banner.
 *
 * This repo hosts my first portfolio. It is kept online as an archive, so every
 * page in it shows a strip pointing at the current site. Self-contained on
 * purpose: it injects its own styles and markup, has no dependencies, and is
 * shared by both sites in this repo (the root static site and /jinja/).
 */
(function () {
    "use strict";

    var NEW_SITE_URL = "https://dileepadari.dev";
    var NEW_SITE_LABEL = "dileepadari.dev";
    var STORAGE_KEY = "archive-banner-dismissed";

    // localStorage throws in private mode on some browsers, and the banner is
    // not important enough to break a page over.
    function readDismissed() {
        try {
            return window.localStorage.getItem(STORAGE_KEY) === "1";
        } catch (err) {
            return false;
        }
    }

    function rememberDismissed() {
        try {
            window.localStorage.setItem(STORAGE_KEY, "1");
        } catch (err) {
            /* ignore */
        }
    }

    var STYLES = [
        ".archive-banner {",
        "  position: fixed;",
        "  top: 0; left: 0; right: 0;",
        "  z-index: 9999;",
        "  display: flex;",
        "  flex-wrap: wrap;",
        "  align-items: center;",
        "  justify-content: center;",
        "  gap: 6px 10px;",
        "  padding: 10px 46px 10px 16px;",
        "  background: #10141a;",
        "  border-bottom: 1px solid rgba(19, 187, 255, .35);",
        "  box-shadow: 0 2px 12px rgba(0, 0, 0, .35);",
        "  color: #e6ebf2;",
        "  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;",
        "  font-size: 14px;",
        "  line-height: 1.4;",
        "  text-align: center;",
        "}",
        ".archive-banner__text { margin: 0; }",
        ".archive-banner__link {",
        "  color: #13bbff;",
        "  font-weight: 600;",
        "  text-decoration: none;",
        "  border-bottom: 1px solid rgba(19, 187, 255, .5);",
        "  white-space: nowrap;",
        "}",
        ".archive-banner__link:hover,",
        ".archive-banner__link:focus { color: #6fd8ff; border-bottom-color: #6fd8ff; }",
        ".archive-banner__close {",
        "  position: absolute;",
        "  top: 50%; right: 10px;",
        "  transform: translateY(-50%);",
        "  width: 28px; height: 28px;",
        "  display: flex;",
        "  align-items: center;",
        "  justify-content: center;",
        "  padding: 0;",
        "  background: none;",
        "  border: 0;",
        "  border-radius: 50%;",
        "  color: #8b97a8;",
        "  font-size: 20px;",
        "  line-height: 1;",
        "  cursor: pointer;",
        "}",
        ".archive-banner__close:hover,",
        ".archive-banner__close:focus { background: rgba(255, 255, 255, .08); color: #e6ebf2; }",
        // Push the page down by exactly the banner's measured height. The
        // `header` rule is for the root site, whose header is position: fixed.
        "html.has-archive-banner body { padding-top: var(--archive-banner-height, 0px); }",
        "html.has-archive-banner header { top: var(--archive-banner-height, 0px); }",
        "html.has-archive-banner { scroll-padding-top: var(--archive-banner-height, 0px); }",
        "@media (max-width: 480px) {",
        "  .archive-banner { font-size: 13px; padding-right: 40px; }",
        "}",
        "@media (prefers-reduced-motion: no-preference) {",
        "  .archive-banner { animation: archive-banner-in .35s ease-out; }",
        "  @keyframes archive-banner-in { from { transform: translateY(-100%); } to { transform: none; } }",
        "}"
    ].join("\n");

    function build() {
        var style = document.createElement("style");
        style.textContent = STYLES;
        document.head.appendChild(style);

        var banner = document.createElement("div");
        banner.className = "archive-banner";
        banner.setAttribute("role", "region");
        banner.setAttribute("aria-label", "Archive notice");

        var text = document.createElement("p");
        text.className = "archive-banner__text";
        text.appendChild(document.createTextNode("You're viewing my old portfolio. My current site is at "));

        var link = document.createElement("a");
        link.className = "archive-banner__link";
        link.href = NEW_SITE_URL;
        link.textContent = NEW_SITE_LABEL + " →";
        text.appendChild(link);

        var close = document.createElement("button");
        close.className = "archive-banner__close";
        close.type = "button";
        close.setAttribute("aria-label", "Dismiss archive notice");
        close.innerHTML = "&times;";

        banner.appendChild(text);
        banner.appendChild(close);
        document.body.insertBefore(banner, document.body.firstChild);

        function measure() {
            document.documentElement.style.setProperty(
                "--archive-banner-height",
                banner.offsetHeight + "px"
            );
        }

        measure();
        document.documentElement.classList.add("has-archive-banner");
        window.addEventListener("resize", measure);

        close.addEventListener("click", function () {
            rememberDismissed();
            window.removeEventListener("resize", measure);
            document.documentElement.classList.remove("has-archive-banner");
            document.documentElement.style.removeProperty("--archive-banner-height");
            banner.remove();
        });
    }

    function init() {
        if (readDismissed() || document.querySelector(".archive-banner")) {
            return;
        }
        build();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
