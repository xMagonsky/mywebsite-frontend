import { useState } from "react";
import { useEffect, useRef } from "react";
import { curveGetTfromY, splitCubicBezier } from "./helpers";

const svgTransforms = {}
const getTransforms = () => {
    let t = ""
    Object.values(svgTransforms).forEach((s) => {
        t += s + " "
    })
    return t
}

function Title(props) {
    const svgRef = useRef()
    const [entryEnded, setEntryEnded] = useState(false)

    const [mobile, setMobile] = useState((window.innerWidth <= 700))
    useEffect(() => {
        const checkWidth = () => {
            (window.innerWidth <= 700) ? setMobile(true) : setMobile(false)
        }

        window.addEventListener("resize", checkWidth)
        return () => window.removeEventListener("resize", checkWidth)
    }, [])

    useEffect(()=>{
        console.log("changed")
    }, [mobile])



    const duration = parseInt(props.entryDuration) || 1000
    const endingDuration = parseInt(props.endingDuration) || 300
    //const mobile = (window.innerWidth < 700)
    
    const size = mobile ? 150 : 300
    const scale = 300 / size
    const line1StartPosition = -(window.innerWidth - size) / 2 * scale
    const line2StartPosition = (window.innerWidth + size) / 2 * scale

    useEffect(() => {
        const svg = svgRef.current
        
        svgTransforms.translate = "translate(-50%, -50%)"
        svg.style.transform = getTransforms()
        
        const a1 = svg.querySelector("#a1")
        const a1Length = Math.ceil(a1.getTotalLength())
        a1.style.strokeDasharray = a1Length
        a1.style.strokeDashoffset = a1Length
        
        const a2 = svg.querySelector("#a2")
        const a2Length = Math.ceil(a2.getTotalLength())
        a2.style.strokeDasharray = a2Length
        a2.style.strokeDashoffset = a2Length
        
        const a3 = svg.querySelector("#a3")
        const a3Length = Math.ceil(a3.getTotalLength())
        a3.style.strokeDasharray = a3Length
        a3.style.strokeDashoffset = a3Length
        
        const b1 = svg.querySelector("#b1")
        b1.style.strokeDasharray = a1Length
        b1.style.strokeDashoffset = a1Length
        
        const b2 = svg.querySelector("#b2")
        b2.style.strokeDasharray = a2Length
        b2.style.strokeDashoffset = a2Length
        
        const b3 = svg.querySelector("#b3")
        b3.style.strokeDasharray = a3Length
        b3.style.strokeDashoffset = a3Length
        
        
        // ENTRY

        const entryDuration = duration * 0.8
        const rotateDuration = duration * 0.2
        const curve = [.2,.8,.6,1]
        
        const totalLength = a1Length + a2Length + a3Length

        const split1 = a1Length / totalLength
        const splittedCurve1 = splitCubicBezier(curve, curveGetTfromY(curve, split1))

        const split2 = a2Length / (a2Length + a3Length)
        const splittedCurve2 = splitCubicBezier(splittedCurve1.right, curveGetTfromY(splittedCurve1.right, split2))
        
        const holeSplit = (a1Length + a2Length + 236) / totalLength
        const holeSpplitedCurve = splitCubicBezier(curve, curveGetTfromY(curve, holeSplit))
        const holeTime = entryDuration * holeSpplitedCurve.progress
        
        const time1 = entryDuration * splittedCurve1.progress
        const time2 = entryDuration * (1 - splittedCurve1.progress) * splittedCurve2.progress
        const time3 = entryDuration * (1 - splittedCurve1.progress) * (1 - splittedCurve2.progress)
        
        svg.style.opacity = 1
        a1.style.animation = `dashes ${time1}ms cubic-bezier(${splittedCurve1.left.toString()}) forwards`
        b1.style.animation = `dashes ${time1}ms cubic-bezier(${splittedCurve1.left.toString()}) forwards`
        a2.style.animation = `dashes ${time2}ms ${time1}ms cubic-bezier(${splittedCurve2.left.toString()}) forwards`
        b2.style.animation = `dashes ${time2}ms ${time1}ms cubic-bezier(${splittedCurve2.left.toString()}) forwards`
        a3.style.animation = `dashes ${time3}ms ${time2 + time1}ms cubic-bezier(${splittedCurve2.right.toString()}) forwards`
        b3.style.animation = `dashes ${time3}ms ${time2 + time1}ms cubic-bezier(${splittedCurve2.right.toString()}) forwards`

        setTimeout(() => {
            a1.setAttribute("x2", "135.11")
            a2.setAttribute("points", "148.47" + a2.getAttribute("points").substr(6))
            b1.setAttribute("x2", "164.45")
            b2.setAttribute("points", "151.09" + b2.getAttribute("points").substr(6))
        }, holeTime);

        setTimeout(() => {
            a1.firstElementChild.beginElement()
            b1.firstElementChild.beginElement()
        }, entryDuration - 300);
        
        //rotate
        setTimeout(() => {
            svg.style.transition = `transform ${rotateDuration}ms ease`
            svgTransforms.rotate = "rotate(58.23deg)"
            svg.style.transform = getTransforms()
            svg.style.position = "absolute"
        }, entryDuration);

        setTimeout(() => {
            setEntryEnded(true)
        }, duration);
        
        
        // const splitAt = 0.93259 // part / ful len
        // const curve = [.5, .9, .8, 1]

        // const splitT = curveGetTfromY(curve, splitAt)
        // console.log(splitT)
        
        // const split = splitCubicBezier(curve, splitT)
        // console.log(split.progress)
        
        // const time1 = 10 * split.progress
        // const time2 = 10 * (1-split.progress)
        
        
        // svgRef.current.querySelectorAll("span")[0].style.transition = `${time1}s cubic-bezier(${split.left.toString()})`
        // svgRef.current.querySelectorAll("span")[0].style.width = "1342px"
        // svgRef.current.querySelectorAll("span")[1].style.transition = `${time2}s ${time1}s cubic-bezier(${split.right.toString()})`
        // svgRef.current.querySelectorAll("span")[1].style.width = "97px"

        // svgRef.current.querySelectorAll("span")[2].style.transition = `${time1 + time2}s cubic-bezier(${[.5, .9, .8, 1].toString()})`
        // svgRef.current.querySelectorAll("span")[2].style.width = "1439px"
    }, [duration])
    
    
    const [textElement, setTextElement] = useState(null)

    useEffect(() => {
        const svg = svgRef.current

        const animLoggedIn = () => {
            const scaleLogo = mobile ? .5 : .3
            const offsetLogo = mobile ? 30 : 100
            
            if (svg.dataset.animated) {
                const centerOffset = mobile ? 70 : (10 + 177)
                svg.style.transition = ""
                svgTransforms.scale = `scale(${scaleLogo})`
                svgTransforms.translate = `translate(calc(-50% - ${centerOffset}px), calc(-50vh - ${offsetLogo}px))`
                svg.style.transform = getTransforms()
                setTextElement(
                    <LoggedIn 
                        titleStyles={{transform: `translate(-${centerOffset}px)`}}
                        titleTextStyles={{transform: "translate(0)"}}
                    />
                )
                return
            }
                
            //slideup
            setTimeout(() => {
                svg.style.transition = `transform ${endingDuration * 0.8}ms ease`
                svgTransforms.translate = `translate(-50%, calc(-50vh - ${offsetLogo}px))`
                svgTransforms.scale = `scale(${scaleLogo})`
                svg.style.transform = getTransforms()
            }, endingDuration * 0.2);
            
            //rollout
            setTimeout(() => {
                svg.classList.add("bigger-stroke")
    
                const centerOffset = mobile ? 70 : (10 + 177)
                svg.style.transition = `transform ${endingDuration}ms ease`
                svgTransforms.translate = `translate(calc(-50% - ${centerOffset}px), calc(-50vh - ${offsetLogo}px))`
                svg.style.transform = getTransforms()
                setTimeout(() => {
                    svg.style.transition = ""
                    svg.dataset.animated = true
                }, endingDuration);
    
                setTextElement(
                    <LoggedIn 
                        titleStyles={{transition: `transform ${endingDuration}ms`, transform: `translate(-${centerOffset}px)`}}
                        titleTextStyles={{transition: `transform ${endingDuration}ms`, transform: "translate(0)"}}
                    />
                )
            }, endingDuration)
        }

        const animNotLoggedIn = () => {
            const offsetLogo = mobile ? -40 : -70
            const offsetText = mobile ? 80 : 130
            setTimeout(() => {
                svg.style.transition = `transform ${endingDuration}ms ease`
                svgTransforms.translate = `translate(-50%, calc(-50% + ${offsetLogo}px))`
                svg.style.transform = getTransforms()

                setTextElement(
                    <NotLoggedIn 
                        titleStyles={{transition: `transform ${endingDuration}ms ease`, transform: `translateY(-100%)`, top: `calc(50vh + ${offsetText}px)`}}
                        titleTextStyles={{transition: `transform ${endingDuration}ms ease`, transform: `translateY(0)`}}
                    />
                )
            }, endingDuration * 0.2);
        }

        if (entryEnded) {
            switch (props.status) {
                case "LOGGED_IN":
                    console.log("LOGGED_IN anim")
                    animLoggedIn()
                    break;
                case "NOT_LOGGED_IN":
                    console.log("NOT_LOGGED_IN anim")
                    animNotLoggedIn()
                    break;
                    
                default:
                    console.log("LOADING anim")
                    break;
            }
        }
    }, [endingDuration, entryEnded, props.status, mobile])

    
    return (
        <div id="logo-container">
            <svg id="magonsky-industries" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" height={size} width={entryEnded ? 300 : "100%"} ref={svgRef}>
                {/* line x2 135.11 - polyline 1st 148.47 */}
                <line id="a1" className="cls-1" x1={line1StartPosition} y1="115.92" x2="141.79" y2="115.92" >
                    <animate attributeName="x1" to="25.57" begin="indefinite" dur=".3s" calcMode="spline" keyTimes="0; 1" keySplines="0 0 0.58 1" fill="freeze" />
                </line>
                <polyline id="a2" className="cls-1" points="141.79 115.93 294.33 115.93 255.37 178.84" />
                <polyline id="a3" className="cls-1" points="249.05 189.04 183.76 294.46 149.78 149.91" />
                <polyline id="b3" className="cls-1" points="50.51 110.78 115.8 5.36 149.78 149.91" />
                <polyline id="b2" className="cls-1" points="157.77 183.9 5.23 183.9 44.19 120.98" />
                {/* polyline 1st 151.09 - line x2 164.45 */}
                <line id="b1" className="cls-1" x1={line2StartPosition} y1="183.91" x2="157.77" y2="183.91" >
                    <animate attributeName="x1" to="274" begin="indefinite" dur=".3s" calcMode="spline" keyTimes="0; 1" keySplines="0 0 0.58 1" fill="freeze" />
                </line>
            </svg>
            {textElement}
        </div>
        
        // <div className={props.size === "big" ? "main-title-big" : "main-title-small"} style={{transition: `${props.duration}ms`}}>
        //     Magonsky industries
        // </div>
        // <div ref={svgRef}>
        //     <span style={{display: "inline-block", width: "0px", height: "10px", backgroundColor: "white", marginRight: "1px"}}>
        //     </span>
        //     <span style={{display: "inline-block", width: "0px", height: "10px", backgroundColor: "white"}}>
        //     </span>
        //     <br />
        //     <span style={{display: "inline-block", width: "0px", height: "10px", backgroundColor: "white"}}>
        //     </span>
        // </div>
    );
}

const LoggedIn = (props) => {
    const [titleStyles, setTitleStyles] = useState({})
    const [titleTextStyles, setTitleTextStyles] = useState({})

    useEffect(() => {
        requestAnimationFrame(() => {
            setTitleStyles(props.titleStyles)
            setTitleTextStyles(props.titleTextStyles)
        });
    }, [props.titleStyles, props.titleTextStyles])

    return (
        <div id="title-loggedin" style={titleStyles}>
            <span style={titleTextStyles}>Magonsky Industries</span>
        </div>
    )
}

const NotLoggedIn = (props) => {
    const [titleStyles, setTitleStyles] = useState({})
    const [titleTextStyles, setTitleTextStyles] = useState({})

    useEffect(() => {
        requestAnimationFrame(() => {
            setTitleStyles(props.titleStyles)
            setTitleTextStyles(props.titleTextStyles)
        });
    }, [props.titleStyles, props.titleTextStyles])

    return (
        <div id="title-notloggedin" style={titleStyles}>
            <span style={titleTextStyles}>
                Magonsky <br />
                Industries
            </span>
        </div>
    )
}

export default Title;
