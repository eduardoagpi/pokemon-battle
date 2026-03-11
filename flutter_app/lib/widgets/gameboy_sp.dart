import 'package:flutter/material.dart';

class GameBoySP extends StatelessWidget {
  final Widget screenContent;
  final VoidCallback? onAPressed;
  final VoidCallback? onBPressed;
  final bool aEnabled;
  final bool bEnabled;

  const GameBoySP({
    super.key,
    required this.screenContent,
    this.onAPressed,
    this.onBPressed,
    this.aEnabled = true,
    this.bEnabled = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.grey[900], // Dark background for the whole screen
      child: Center(
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // --- TOP PART (SCREEN) ---
              Container(
                width: 340,
                height: 450,
                decoration: BoxDecoration(
                  color: const Color(0xFF333333),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.black, width: 8),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.5),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(8),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: screenContent,
                ),
              ),

              // --- HINGE ---
              Container(
                width: 300,
                height: 20,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.grey[700]!,
                      Colors.grey[850]!,
                      Colors.grey[600]!,
                    ],
                  ),
                ),
              ),

              // --- BOTTOM PART (CONTROLS) ---
              Container(
                width: 340,
                height: 320,
                decoration: BoxDecoration(
                  color: const Color(0xFF666666),
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(20),
                    bottomRight: Radius.circular(20),
                  ),
                  border: Border.all(color: Colors.black, width: 4),
                ),
                child: Stack(
                  children: [
                    // D-Pad (Visual only)
                    Positioned(left: 30, top: 60, child: _buildDPad()),

                    // Speaker holes
                    Positioned(left: 140, top: 150, child: _buildSpeaker()),

                    // Power Indicator
                    const Positioned(
                      right: 20,
                      top: 20,
                      child: Icon(Icons.circle, color: Colors.green, size: 8),
                    ),

                    // Buttons A and B
                    Positioned(
                      right: 30,
                      top: 40,
                      child: Row(
                        children: [
                          _buildButton(
                            label: 'B',
                            color: Colors.red[900]!,
                            onPressed: bEnabled ? onBPressed : null,
                            subLabel: 'RUN',
                          ),
                          const SizedBox(width: 20),
                          _buildButton(
                            label: 'A',
                            color: Colors.red[900]!,
                            onPressed: aEnabled ? onAPressed : null,
                            subLabel: 'ATTACK',
                          ),
                        ],
                      ),
                    ),

                    // Start/Select (Visual only)
                    Positioned(
                      bottom: 40,
                      left: 100,
                      child: Row(
                        children: [
                          _buildSmallButton('SELECT'),
                          const SizedBox(width: 40),
                          _buildSmallButton('START'),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDPad() {
    return SizedBox(
      width: 100,
      height: 100,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Container(
            width: 30,
            height: 90,
            decoration: BoxDecoration(
              color: Colors.black87,
              borderRadius: BorderRadius.circular(4),
            ),
          ),
          Container(
            width: 90,
            height: 30,
            decoration: BoxDecoration(
              color: Colors.black87,
              borderRadius: BorderRadius.circular(4),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildButton({
    required String label,
    required Color color,
    required VoidCallback? onPressed,
    required String subLabel,
  }) {
    return Column(
      children: [
        GestureDetector(
          onTap: onPressed,
          child: Container(
            width: 55,
            height: 55,
            decoration: BoxDecoration(
              color: onPressed != null ? color : Colors.grey[800],
              shape: BoxShape.circle,
              border: Border.all(color: Colors.black, width: 3),
              boxShadow: [
                if (onPressed != null)
                  const BoxShadow(
                    color: Colors.black26,
                    offset: Offset(2, 2),
                    blurRadius: 2,
                  ),
              ],
            ),
            child: Center(
              child: Text(
                label,
                style: const TextStyle(
                  color: Colors.white70,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          subLabel,
          style: const TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.bold,
            fontSize: 10,
          ),
        ),
      ],
    );
  }

  Widget _buildSmallButton(String label) {
    return Column(
      children: [
        Container(
          width: 40,
          height: 12,
          decoration: BoxDecoration(
            color: Colors.grey[800],
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: Colors.black, width: 1),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.bold,
            fontSize: 8,
          ),
        ),
      ],
    );
  }

  Widget _buildSpeaker() {
    return SizedBox(
      width: 60,
      height: 60,
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: List.generate(
          9,
          (index) => Container(
            width: 4,
            height: 4,
            decoration: const BoxDecoration(
              color: Colors.black54,
              shape: BoxShape.circle,
            ),
          ),
        ),
      ),
    );
  }
}
