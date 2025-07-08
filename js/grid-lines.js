// Grid Lines Animation for CTA Sections
// Adapted from p5.js diagonal lines sketch

class GridLinesAnimation {
    constructor(containerId) {
        this.containerId = containerId;
        this.gridLines = [];
        this.spacing = 60;
        this.canvas = null;
        this.container = null;
        this.isInitialized = false;
    }

    init() {
        // Check if p5.js is loaded
        if (typeof p5 === 'undefined') {
            console.warn('p5.js not loaded, skipping grid animation');
            return;
        }

        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.warn(`Container ${this.containerId} not found`);
            return;
        }

        // Create p5 instance mode
        new p5((p) => {
            p.setup = () => {
                const rect = this.container.getBoundingClientRect();
                this.canvas = p.createCanvas(rect.width, rect.height);
                this.canvas.parent(this.containerId);
                this.canvas.style('position', 'absolute');
                this.canvas.style('top', '0');
                this.canvas.style('left', '0');
                this.canvas.style('z-index', '0');
                this.canvas.style('pointer-events', 'none');
                this.createGrid(p);
                this.isInitialized = true;
            };

            p.draw = () => {
                // Use CSS primary color values (turquoise #41a38f)
                p.background(65, 163, 143); // Primary green color
                
                for (let gridLine of this.gridLines) {
                    // Calculate distance from mouse to line
                    let distance = this.distancePointToLine(
                        p.mouseX, p.mouseY,
                        gridLine.originalX1, gridLine.originalY1,
                        gridLine.originalX2, gridLine.originalY2,
                        p
                    );
                    
                    // Calculate color intensity based on distance
                    let maxDistance = 200;
                    let alpha = 15; // Very subtle base transparency
                    
                    if (distance < maxDistance) {
                        let influence = p.map(distance, 0, maxDistance, 1, 0);
                        alpha = p.map(influence, 0, 1, 15, 80); // Subtle effect
                    }
                    
                    // Draw line with lighter green color (lighter than #41a38f)
                    p.stroke(120, 200, 180, alpha); // Lighter turquoise
                    p.strokeWeight(1);
                    p.line(gridLine.originalX1, gridLine.originalY1, 
                           gridLine.originalX2, gridLine.originalY2);
                }
            };

            p.windowResized = () => {
                if (this.container) {
                    const rect = this.container.getBoundingClientRect();
                    p.resizeCanvas(rect.width, rect.height);
                    this.createGrid(p);
                }
            };
        });
    }

    createGrid(p) {
        this.gridLines = [];
        
        // Diagonal lines from top-right to bottom-left (steeper)
        let numDiagonal = Math.ceil((p.width + p.height) / this.spacing);
        for (let i = -numDiagonal; i <= numDiagonal; i++) {
            let startX = p.width - i * this.spacing;
            let startY = 0;
            let endX = startX - (p.height / 2); // Steeper angle
            let endY = p.height;
            
            this.gridLines.push({
                x1: startX, y1: startY, x2: endX, y2: endY,
                originalX1: startX, originalY1: startY, originalX2: endX, originalY2: endY,
                type: 'diagonal'
            });
        }
    }

    distancePointToLine(px, py, x1, y1, x2, y2, p) {
        let A = px - x1;
        let B = py - y1;
        let C = x2 - x1;
        let D = y2 - y1;
        
        let dot = A * C + B * D;
        let lenSq = C * C + D * D;
        
        if (lenSq === 0) return p.dist(px, py, x1, y1);
        
        let param = dot / lenSq;
        
        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        return p.dist(px, py, xx, yy);
    }
}

// Auto-initialize for CTA sections when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure p5.js is loaded if it's being loaded
    setTimeout(() => {
        // Find all CTA sections and add animation
        const ctaSections = document.querySelectorAll('.cta');
        ctaSections.forEach((section, index) => {
            // Create unique canvas container
            const canvasId = `cta-canvas-${index}`;
            const canvasDiv = document.createElement('div');
            canvasDiv.id = canvasId;
            canvasDiv.style.position = 'absolute';
            canvasDiv.style.top = '0';
            canvasDiv.style.left = '0';
            canvasDiv.style.width = '100%';
            canvasDiv.style.height = '100%';
            canvasDiv.style.pointerEvents = 'none';
            canvasDiv.style.zIndex = '0';
            
            // Make sure section is relatively positioned
            section.style.position = 'relative';
            section.style.overflow = 'hidden';
            
            // Insert canvas container
            section.insertBefore(canvasDiv, section.firstChild);
            
            // Initialize animation
            const animation = new GridLinesAnimation(canvasId);
            animation.init();
        });
    }, 100);
});