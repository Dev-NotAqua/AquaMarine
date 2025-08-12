'use client';

import { GridBackground, AnimatedGridBackground, DottedGridBackground } from '@/components/ui/grid-background';
import { cn } from '@/lib/utils';

export default function GridDemoPage() {
  return (
    <div className="min-h-screen bg-charcoal-950">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Bigger & Brighter Grid Demo</h1>
        <p className="text-charcoal-300 mb-12 text-center">Larger, more visible royal purple grids with enhanced lighting</p>
        
        <div className="space-y-12">
          {/* Enhanced Grid Options */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">Grid Variations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Standard Grid */}
              <div className="h-48 rounded-lg overflow-hidden">
                <GridBackground size={40} color="rgba(147, 51, 234, 0.15)" className="h-full">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-white">Standard Grid</h4>
                      <p className="text-sm text-gray-400">40px spacing</p>
                    </div>
                  </div>
                </GridBackground>
              </div>

              {/* Dense Grid */}
              <div className="h-48 rounded-lg overflow-hidden">
                <GridBackground size={20} color="rgba(147, 51, 234, 0.2)" className="h-full">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-white">Dense Grid</h4>
                      <p className="text-sm text-gray-400">20px spacing</p>
                    </div>
                  </div>
                </GridBackground>
              </div>

              {/* Light Grid */}
              <div className="h-48 rounded-lg overflow-hidden">
                <GridBackground size={60} color="rgba(147, 51, 234, 0.1)" className="h-full">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-white">Light Grid</h4>
                      <p className="text-sm text-gray-400">60px spacing</p>
                    </div>
                  </div>
                </GridBackground>
              </div>

              {/* Standard Dots */}
              <div className="h-48 rounded-lg overflow-hidden">
                <DottedGridBackground size={30} color="rgba(147, 51, 234, 0.15)" className="h-full">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-white">Standard Dots</h4>
                      <p className="text-sm text-gray-400">30px spacing</p>
                    </div>
                  </div>
                </DottedGridBackground>
              </div>

              {/* Dense Dots */}
              <div className="h-48 rounded-lg overflow-hidden">
                <DottedGridBackground size={15} color="rgba(147, 51, 234, 0.2)" className="h-full">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-white">Dense Dots</h4>
                      <p className="text-sm text-gray-400">15px spacing</p>
                    </div>
                  </div>
                </DottedGridBackground>
              </div>

              {/* Animated Grid */}
              <div className="h-48 rounded-lg overflow-hidden">
                <AnimatedGridBackground color="rgba(147, 51, 234, 0.15)" className="h-full">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-white">Animated Grid</h4>
                      <p className="text-sm text-gray-400">Pulsing effect</p>
                    </div>
                  </div>
                </AnimatedGridBackground>
              </div>
            </div>
          </section>

          {/* Full Page Example */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">Full Page Example</h2>
            <div className="h-96 rounded-lg overflow-hidden">
              <GridBackground size={50} color="rgba(147, 51, 234, 0.12)" className="h-full">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-2">Royal Purple Grid</h3>
                    <p className="text-gray-400">Enhanced contrast and visibility</p>
                  </div>
                </div>
              </GridBackground>
            </div>
          </section>

          {/* Classic Examples */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">Classic Examples</h2>
            <div className="space-y-8">
              <div className="h-96 rounded-lg overflow-hidden">
                <GridBackground className="h-full">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-white mb-2">Classic Grid</h3>
                      <p className="text-gray-400">Clean dark charcoal grid</p>
                    </div>
                  </div>
                </GridBackground>
              </div>

              <div className="h-96 rounded-lg overflow-hidden">
                <AnimatedGridBackground className="h-full">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-white mb-2">Animated Grid</h3>
                      <p className="text-gray-400">Subtle pulse animation</p>
                    </div>
                  </div>
                </AnimatedGridBackground>
              </div>

              <div className="h-96 rounded-lg overflow-hidden">
                <DottedGridBackground className="h-full">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-white mb-2">Dotted Grid</h3>
                      <p className="text-gray-400">Minimal dotted pattern</p>
                    </div>
                  </div>
                </DottedGridBackground>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}