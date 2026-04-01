import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// ============================================================================
// VIDYA AI QUESTION BANK - 160 JEE/NEET Style Questions
// Physics: 40, Chemistry: 40, Mathematics: 40, Biology: 40
// ============================================================================

const QUESTIONS = [
  // ============================================================================
  // PHYSICS (40 Questions) - JEE Exam
  // ============================================================================

  // KINEMATICS (4 questions)
  {
    questionId: 'PHY-001',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Kinematics',
    topic: 'Equations of Motion',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'A particle starts from rest and moves with uniform acceleration of 5 m/s². The distance covered in the 4th second is:',
    options: [
      { id: 'a', text: '17.5 m' },
      { id: 'b', text: '15 m' },
      { id: 'c', text: '20 m' },
      { id: 'd', text: '12.5 m' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'Distance in nth second: Sn = u + a(2n-1)/2',
        'Here u = 0, a = 5 m/s², n = 4',
        'S4 = 0 + 5(2×4-1)/2 = 5×7/2 = 17.5 m'
      ],
      explanation: 'Use the formula for distance covered in nth second of uniformly accelerated motion.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-002',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Kinematics',
    topic: 'Projectile Motion',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'A projectile is thrown at 60° to horizontal with velocity 40 m/s. The maximum height reached is: (g = 10 m/s²)',
    options: [
      { id: 'a', text: '40 m' },
      { id: 'b', text: '60 m' },
      { id: 'c', text: '80 m' },
      { id: 'd', text: '30 m' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Maximum height H = u²sin²θ/(2g)',
        'u = 40 m/s, θ = 60°, g = 10 m/s²',
        'H = (40)² × (sin60°)² / (2×10)',
        'H = 1600 × 0.75 / 20 = 60 m'
      ],
      explanation: 'Use the standard projectile motion formula for maximum height.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-003',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Kinematics',
    topic: 'Relative Velocity',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Rain falls vertically at 10 m/s. A man walks at 6 m/s. The angle at which he should hold umbrella with vertical is:',
    options: [
      { id: 'a', text: 'tan⁻¹(0.6)' },
      { id: 'b', text: 'tan⁻¹(1.67)' },
      { id: 'c', text: 'tan⁻¹(0.3)' },
      { id: 'd', text: 'tan⁻¹(0.5)' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'Relative velocity of rain w.r.t. man has horizontal component = man velocity = 6 m/s',
        'Vertical component = rain velocity = 10 m/s',
        'tan θ = horizontal/vertical = 6/10 = 0.6',
        'θ = tan⁻¹(0.6)'
      ],
      explanation: 'Find the direction of relative velocity of rain with respect to the moving man.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-004',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Kinematics',
    topic: 'Graphs',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'A body has velocity 20 m/s at t=0 and retardation 2 m/s². When will velocity become zero?',
    options: [
      { id: 'a', text: '5 s' },
      { id: 'b', text: '10 s' },
      { id: 'c', text: '15 s' },
      { id: 'd', text: '20 s' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Using v = u + at',
        '0 = 20 + (-2)t',
        '2t = 20',
        't = 10 s'
      ],
      explanation: 'For retardation, acceleration is negative. Set final velocity to zero and solve.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // LAWS OF MOTION (4 questions)
  {
    questionId: 'PHY-005',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Laws of Motion',
    topic: 'Newton Second Law',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'A 5 kg block is pushed with 25 N force on frictionless surface. Its acceleration is:',
    options: [
      { id: 'a', text: '3 m/s²' },
      { id: 'b', text: '5 m/s²' },
      { id: 'c', text: '4 m/s²' },
      { id: 'd', text: '6 m/s²' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Using Newton second law: F = ma',
        '25 = 5 × a',
        'a = 5 m/s²'
      ],
      explanation: 'Direct application of F = ma for a single body.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-006',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Laws of Motion',
    topic: 'Friction',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'A 20 kg block on rough surface (μ = 0.4) is pushed with 100 N. Net force on block is: (g = 10 m/s²)',
    options: [
      { id: 'a', text: '20 N' },
      { id: 'b', text: '80 N' },
      { id: 'c', text: '100 N' },
      { id: 'd', text: '0 N' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'Normal force N = mg = 20 × 10 = 200 N',
        'Friction force f = μN = 0.4 × 200 = 80 N',
        'Net force = Applied - Friction = 100 - 80 = 20 N'
      ],
      explanation: 'Net force is applied force minus kinetic friction.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-007',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Laws of Motion',
    topic: 'Connected Bodies',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Two masses 3 kg and 2 kg connected by string over pulley. Acceleration of system is: (g = 10 m/s²)',
    options: [
      { id: 'a', text: '1 m/s²' },
      { id: 'b', text: '2 m/s²' },
      { id: 'c', text: '3 m/s²' },
      { id: 'd', text: '4 m/s²' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Net force = (m1 - m2)g = (3 - 2) × 10 = 10 N',
        'Total mass = m1 + m2 = 5 kg',
        'Acceleration a = F/m = 10/5 = 2 m/s²'
      ],
      explanation: 'For Atwood machine, a = (m1-m2)g/(m1+m2).'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-008',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Laws of Motion',
    topic: 'Circular Motion',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'A car takes circular turn of radius 50 m at 25 m/s. Centripetal acceleration is:',
    options: [
      { id: 'a', text: '10.5 m/s²' },
      { id: 'b', text: '12.5 m/s²' },
      { id: 'c', text: '15 m/s²' },
      { id: 'd', text: '8.5 m/s²' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Centripetal acceleration ac = v²/r',
        'ac = (25)²/50 = 625/50 = 12.5 m/s²'
      ],
      explanation: 'Centripetal acceleration formula: v²/r directed toward center.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // WORK, ENERGY, POWER (4 questions)
  {
    questionId: 'PHY-009',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Work Energy Power',
    topic: 'Work Done',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'A force of 10 N displaces an object 5 m at 60° to force direction. Work done is:',
    options: [
      { id: 'a', text: '50 J' },
      { id: 'b', text: '25 J' },
      { id: 'c', text: '25√3 J' },
      { id: 'd', text: '100 J' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Work W = Fs cos θ',
        'W = 10 × 5 × cos60°',
        'W = 50 × 0.5 = 25 J'
      ],
      explanation: 'Work done is the product of force, displacement, and cosine of angle between them.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-010',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Work Energy Power',
    topic: 'Kinetic Energy',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'If velocity of a body is doubled, its kinetic energy becomes:',
    options: [
      { id: 'a', text: 'Double' },
      { id: 'b', text: 'Half' },
      { id: 'c', text: 'Four times' },
      { id: 'd', text: 'Same' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'KE = ½mv²',
        'If v becomes 2v: KE new = ½m(2v)² = ½m(4v²) = 4 × ½mv²',
        'KE becomes 4 times'
      ],
      explanation: 'Kinetic energy is proportional to square of velocity.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-011',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Work Energy Power',
    topic: 'Conservation of Energy',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'A 2 kg ball is dropped from 45 m. Its velocity just before hitting ground is: (g = 10 m/s²)',
    options: [
      { id: 'a', text: '25 m/s' },
      { id: 'b', text: '30 m/s' },
      { id: 'c', text: '35 m/s' },
      { id: 'd', text: '20 m/s' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Using energy conservation: mgh = ½mv²',
        'gh = ½v²',
        'v² = 2gh = 2 × 10 × 45 = 900',
        'v = 30 m/s'
      ],
      explanation: 'Potential energy converts to kinetic energy. Mass cancels out.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-012',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Work Energy Power',
    topic: 'Power',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'An engine of power 10 kW pulls a train at constant 20 m/s. The force exerted by engine is:',
    options: [
      { id: 'a', text: '200 N' },
      { id: 'b', text: '500 N' },
      { id: 'c', text: '1000 N' },
      { id: 'd', text: '2000 N' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Power P = Force × velocity',
        '10000 = F × 20',
        'F = 10000/20 = 500 N'
      ],
      explanation: 'At constant velocity, power = force × velocity.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // THERMODYNAMICS (4 questions)
  {
    questionId: 'PHY-013',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Thermodynamics',
    topic: 'First Law',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'In an isothermal process, the change in internal energy is:',
    options: [
      { id: 'a', text: 'Maximum' },
      { id: 'b', text: 'Zero' },
      { id: 'c', text: 'Minimum' },
      { id: 'd', text: 'Cannot be determined' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'In isothermal process, temperature is constant',
        'Internal energy U depends only on temperature for ideal gas',
        'ΔU = nCvΔT = 0 (as ΔT = 0)'
      ],
      explanation: 'For ideal gas, internal energy depends only on temperature.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-014',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Thermodynamics',
    topic: 'Specific Heat',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'For a monoatomic ideal gas, ratio Cp/Cv equals:',
    options: [
      { id: 'a', text: '1.4' },
      { id: 'b', text: '1.67' },
      { id: 'c', text: '1.33' },
      { id: 'd', text: '1.5' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'For monoatomic gas, degrees of freedom f = 3',
        'Cv = (f/2)R = 3R/2',
        'Cp = Cv + R = 5R/2',
        'γ = Cp/Cv = (5R/2)/(3R/2) = 5/3 = 1.67'
      ],
      explanation: 'γ = 1 + 2/f for ideal gases. For monoatomic gas f=3.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-015',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Thermodynamics',
    topic: 'Carnot Engine',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'A Carnot engine operates between 500 K and 300 K. Its efficiency is:',
    options: [
      { id: 'a', text: '30%' },
      { id: 'b', text: '40%' },
      { id: 'c', text: '50%' },
      { id: 'd', text: '60%' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Carnot efficiency η = 1 - T2/T1',
        'η = 1 - 300/500 = 1 - 0.6 = 0.4',
        'η = 40%'
      ],
      explanation: 'Carnot efficiency depends only on temperatures of reservoirs.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-016',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Thermodynamics',
    topic: 'Adiabatic Process',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'In an adiabatic process:',
    options: [
      { id: 'a', text: 'Heat exchanged is zero' },
      { id: 'b', text: 'Work done is zero' },
      { id: 'c', text: 'Temperature remains constant' },
      { id: 'd', text: 'Pressure remains constant' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'Adiabatic means thermally isolated',
        'No heat exchange with surroundings',
        'Q = 0 for adiabatic process'
      ],
      explanation: 'By definition, adiabatic process has zero heat transfer.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // ELECTROSTATICS (4 questions)
  {
    questionId: 'PHY-017',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Electrostatics',
    topic: 'Coulomb Law',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Two charges 2μC each are 0.3 m apart. Force between them is: (k = 9×10⁹)',
    options: [
      { id: 'a', text: '0.2 N' },
      { id: 'b', text: '0.4 N' },
      { id: 'c', text: '0.6 N' },
      { id: 'd', text: '0.8 N' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'F = kq1q2/r²',
        'F = 9×10⁹ × 2×10⁻⁶ × 2×10⁻⁶ / (0.3)²',
        'F = 9×10⁹ × 4×10⁻¹² / 0.09',
        'F = 36×10⁻³ / 0.09 = 0.4 N'
      ],
      explanation: 'Direct application of Coulomb law.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-018',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Electrostatics',
    topic: 'Electric Field',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Electric potential at distance r from point charge q is V. The electric field at same point is:',
    options: [
      { id: 'a', text: 'V/r' },
      { id: 'b', text: 'Vr' },
      { id: 'c', text: 'V/r²' },
      { id: 'd', text: 'V²/r' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'V = kq/r and E = kq/r²',
        'E = kq/r² = (kq/r) × (1/r) = V/r'
      ],
      explanation: 'E = -dV/dr. For point charge, E = V/r.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-019',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Electrostatics',
    topic: 'Capacitance',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Three capacitors 2μF, 3μF, 6μF are in series. Equivalent capacitance is:',
    options: [
      { id: 'a', text: '11 μF' },
      { id: 'b', text: '1 μF' },
      { id: 'c', text: '0.5 μF' },
      { id: 'd', text: '6 μF' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        '1/Ceq = 1/C1 + 1/C2 + 1/C3',
        '1/Ceq = 1/2 + 1/3 + 1/6',
        '1/Ceq = 3/6 + 2/6 + 1/6 = 6/6 = 1',
        'Ceq = 1 μF'
      ],
      explanation: 'For capacitors in series, reciprocals add.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-020',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Electrostatics',
    topic: 'Gauss Law',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Electric flux through closed surface enclosing charge 5μC is: (ε₀ = 8.85×10⁻¹²)',
    options: [
      { id: 'a', text: '5.65×10⁵ Nm²/C' },
      { id: 'b', text: '4.43×10⁻¹⁷ Nm²/C' },
      { id: 'c', text: '5×10⁶ Nm²/C' },
      { id: 'd', text: '8.85×10⁻⁷ Nm²/C' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'By Gauss law: Φ = q/ε₀',
        'Φ = 5×10⁻⁶ / 8.85×10⁻¹²',
        'Φ = 5.65×10⁵ Nm²/C'
      ],
      explanation: 'Gauss law states total flux through closed surface equals enclosed charge divided by ε₀.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // CURRENT ELECTRICITY (4 questions)
  {
    questionId: 'PHY-021',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Current Electricity',
    topic: 'Ohm Law',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'A 12V battery is connected to 4Ω resistor. Current flowing is:',
    options: [
      { id: 'a', text: '2 A' },
      { id: 'b', text: '3 A' },
      { id: 'c', text: '4 A' },
      { id: 'd', text: '6 A' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Using Ohm law: V = IR',
        '12 = I × 4',
        'I = 3 A'
      ],
      explanation: 'Direct application of Ohm law.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-022',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Current Electricity',
    topic: 'Resistors in Parallel',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Two resistors 6Ω and 12Ω are in parallel. Equivalent resistance is:',
    options: [
      { id: 'a', text: '18 Ω' },
      { id: 'b', text: '4 Ω' },
      { id: 'c', text: '2 Ω' },
      { id: 'd', text: '8 Ω' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        '1/Req = 1/R1 + 1/R2',
        '1/Req = 1/6 + 1/12 = 2/12 + 1/12 = 3/12 = 1/4',
        'Req = 4 Ω'
      ],
      explanation: 'For parallel resistors, reciprocals add.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-023',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Current Electricity',
    topic: 'Power',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Power dissipated in 10Ω resistor carrying 2A current is:',
    options: [
      { id: 'a', text: '20 W' },
      { id: 'b', text: '40 W' },
      { id: 'c', text: '80 W' },
      { id: 'd', text: '100 W' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Power P = I²R',
        'P = (2)² × 10 = 4 × 10 = 40 W'
      ],
      explanation: 'Power in resistor: P = I²R = V²/R = VI.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-024',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Current Electricity',
    topic: 'Kirchhoff Laws',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'In a circuit, sum of currents entering a junction equals sum of currents leaving. This is:',
    options: [
      { id: 'a', text: 'Ohm law' },
      { id: 'b', text: 'Kirchhoff current law' },
      { id: 'c', text: 'Kirchhoff voltage law' },
      { id: 'd', text: 'Faraday law' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'This is statement of conservation of charge',
        'KCL: ΣI_in = ΣI_out at any junction',
        'Also written as ΣI = 0'
      ],
      explanation: 'Kirchhoff Current Law is based on conservation of charge.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // MAGNETISM (4 questions)
  {
    questionId: 'PHY-025',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Magnetism',
    topic: 'Magnetic Force',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'A charge moving parallel to magnetic field experiences:',
    options: [
      { id: 'a', text: 'Maximum force' },
      { id: 'b', text: 'Zero force' },
      { id: 'c', text: 'Force perpendicular to velocity' },
      { id: 'd', text: 'Retarding force' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'F = qvB sinθ',
        'When v is parallel to B, θ = 0°',
        'F = qvB sin0° = 0'
      ],
      explanation: 'Magnetic force is proportional to sin of angle between v and B.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-026',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Magnetism',
    topic: 'Biot-Savart Law',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Magnetic field at center of circular loop carrying current I with radius R is:',
    options: [
      { id: 'a', text: 'μ₀I/R' },
      { id: 'b', text: 'μ₀I/2R' },
      { id: 'c', text: 'μ₀I/4R' },
      { id: 'd', text: '2μ₀I/R' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Using Biot-Savart law for circular loop',
        'B = μ₀I/2R at center',
        'This is a standard result'
      ],
      explanation: 'Field at center of circular loop: B = μ₀I/2R.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-027',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Magnetism',
    topic: 'Solenoid',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'A solenoid has 500 turns per meter carrying 2A. Magnetic field inside is: (μ₀ = 4π×10⁻⁷)',
    options: [
      { id: 'a', text: '1.26×10⁻³ T' },
      { id: 'b', text: '2.52×10⁻³ T' },
      { id: 'c', text: '6.28×10⁻⁴ T' },
      { id: 'd', text: '3.14×10⁻³ T' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'B = μ₀nI for solenoid',
        'B = 4π×10⁻⁷ × 500 × 2',
        'B = 4000π×10⁻⁷ = 1.26×10⁻³ T'
      ],
      explanation: 'Inside a long solenoid, B = μ₀nI where n is turns per unit length.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-028',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Magnetism',
    topic: 'Electromagnetic Induction',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'According to Lenz law, induced current opposes:',
    options: [
      { id: 'a', text: 'The applied EMF' },
      { id: 'b', text: 'The change in magnetic flux' },
      { id: 'c', text: 'The resistance of circuit' },
      { id: 'd', text: 'The current in primary' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Lenz law: Induced EMF opposes cause',
        'The cause is change in magnetic flux',
        'Hence induced current opposes change in flux'
      ],
      explanation: 'Lenz law is about opposing the change that caused induction.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // OPTICS (4 questions)
  {
    questionId: 'PHY-029',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Optics',
    topic: 'Refraction',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Light travels from air to glass (n=1.5). If angle of incidence is 30°, sin(angle of refraction) is:',
    options: [
      { id: 'a', text: '1/3' },
      { id: 'b', text: '1/2' },
      { id: 'c', text: '3/4' },
      { id: 'd', text: '0.25' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'Using Snell law: n1 sinθ1 = n2 sinθ2',
        '1 × sin30° = 1.5 × sinθ2',
        'sinθ2 = 0.5/1.5 = 1/3'
      ],
      explanation: 'Apply Snell law directly.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-030',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Optics',
    topic: 'Mirror Formula',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Concave mirror has focal length 20 cm. Object at 30 cm. Image distance is:',
    options: [
      { id: 'a', text: '60 cm' },
      { id: 'b', text: '-60 cm' },
      { id: 'c', text: '12 cm' },
      { id: 'd', text: '-12 cm' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        '1/v + 1/u = 1/f',
        'u = -30 cm (object), f = -20 cm (concave)',
        '1/v = 1/(-20) - 1/(-30) = -1/20 + 1/30',
        '1/v = -3/60 + 2/60 = -1/60',
        'v = -60 cm (real image)'
      ],
      explanation: 'Use mirror formula with proper sign convention.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-031',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Optics',
    topic: 'Lens Power',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'A convex lens has focal length 25 cm. Its power is:',
    options: [
      { id: 'a', text: '+2.5 D' },
      { id: 'b', text: '+4 D' },
      { id: 'c', text: '-4 D' },
      { id: 'd', text: '+0.25 D' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Power P = 100/f (when f in cm)',
        'P = 100/25 = 4 D',
        'Positive for convex lens'
      ],
      explanation: 'Power in diopters = 1/f(in meters) = 100/f(in cm).'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-032',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Optics',
    topic: 'Interference',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'In Young double slit experiment, if slit separation is halved and screen distance doubled, fringe width becomes:',
    options: [
      { id: 'a', text: 'Same' },
      { id: 'b', text: 'Double' },
      { id: 'c', text: 'Four times' },
      { id: 'd', text: 'Half' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Fringe width β = λD/d',
        'If d → d/2 and D → 2D',
        'β new = λ(2D)/(d/2) = 4λD/d = 4β'
      ],
      explanation: 'Fringe width is proportional to D and inversely to d.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // MODERN PHYSICS (4 questions)
  {
    questionId: 'PHY-033',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Modern Physics',
    topic: 'Photoelectric Effect',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Photoelectric effect demonstrates:',
    options: [
      { id: 'a', text: 'Wave nature of light' },
      { id: 'b', text: 'Particle nature of light' },
      { id: 'c', text: 'Both wave and particle' },
      { id: 'd', text: 'Neither' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Photoelectric effect explained by photon theory',
        'Light behaves as particles (photons)',
        'Energy E = hν for each photon'
      ],
      explanation: 'Einstein explained photoelectric effect using quantum theory of light.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-034',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Modern Physics',
    topic: 'de Broglie Wavelength',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'de Broglie wavelength of particle with momentum p is:',
    options: [
      { id: 'a', text: 'hp' },
      { id: 'b', text: 'h/p' },
      { id: 'c', text: 'p/h' },
      { id: 'd', text: 'h²/p' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'de Broglie relation: λ = h/p',
        'h is Planck constant',
        'p is momentum of particle'
      ],
      explanation: 'de Broglie wavelength is inversely proportional to momentum.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-035',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Modern Physics',
    topic: 'Bohr Model',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'In hydrogen atom, ratio of radii of 2nd and 1st orbit is:',
    options: [
      { id: 'a', text: '2:1' },
      { id: 'b', text: '4:1' },
      { id: 'c', text: '1:2' },
      { id: 'd', text: '1:4' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Bohr radius: rn ∝ n²',
        'r2/r1 = (2)²/(1)² = 4/1',
        'Ratio = 4:1'
      ],
      explanation: 'Orbital radius in Bohr model is proportional to n².'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-036',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Modern Physics',
    topic: 'Radioactivity',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'After 3 half-lives, fraction of radioactive sample remaining is:',
    options: [
      { id: 'a', text: '1/2' },
      { id: 'b', text: '1/4' },
      { id: 'c', text: '1/8' },
      { id: 'd', text: '1/16' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'After n half-lives, fraction = (1/2)ⁿ',
        'For n = 3: fraction = (1/2)³ = 1/8'
      ],
      explanation: 'Each half-life reduces the sample by half.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // WAVES (4 questions)
  {
    questionId: 'PHY-037',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Waves',
    topic: 'Wave Equation',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Speed of wave with frequency 100 Hz and wavelength 2 m is:',
    options: [
      { id: 'a', text: '50 m/s' },
      { id: 'b', text: '200 m/s' },
      { id: 'c', text: '100 m/s' },
      { id: 'd', text: '400 m/s' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Wave speed v = fλ',
        'v = 100 × 2 = 200 m/s'
      ],
      explanation: 'Fundamental wave equation: v = fλ.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-038',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Waves',
    topic: 'Sound Waves',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Speed of sound in air is maximum at:',
    options: [
      { id: 'a', text: '0°C' },
      { id: 'b', text: '25°C' },
      { id: 'c', text: '50°C' },
      { id: 'd', text: '-10°C' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Speed of sound v ∝ √T (T in Kelvin)',
        'Higher temperature = higher speed',
        '50°C has highest temperature'
      ],
      explanation: 'Speed of sound increases with temperature.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-039',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Waves',
    topic: 'Standing Waves',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Fundamental frequency of pipe open at both ends is 200 Hz. First overtone is:',
    options: [
      { id: 'a', text: '200 Hz' },
      { id: 'b', text: '400 Hz' },
      { id: 'c', text: '600 Hz' },
      { id: 'd', text: '300 Hz' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Open pipe: all harmonics present',
        'Fundamental = f, First overtone = 2f',
        'First overtone = 2 × 200 = 400 Hz'
      ],
      explanation: 'For open pipe, harmonics are f, 2f, 3f, ...'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'PHY-040',
    exam: 'JEE',
    subject: 'physics',
    chapter: 'Waves',
    topic: 'Doppler Effect',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'A source of frequency 500 Hz moves toward stationary observer at 20 m/s. Apparent frequency is: (v_sound = 340 m/s)',
    options: [
      { id: 'a', text: '531 Hz' },
      { id: 'b', text: '472 Hz' },
      { id: 'c', text: '500 Hz' },
      { id: 'd', text: '550 Hz' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'When source approaches: f′ = f × v/(v-vs)',
        'f′ = 500 × 340/(340-20)',
        'f′ = 500 × 340/320 = 531.25 Hz'
      ],
      explanation: 'Doppler effect: frequency increases when source approaches.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // ============================================================================
  // CHEMISTRY (40 Questions) - JEE Exam
  // ============================================================================

  // ATOMIC STRUCTURE (4 questions)
  {
    questionId: 'CHM-001',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Atomic Structure',
    topic: 'Quantum Numbers',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'The maximum number of electrons in a subshell with l=2 is:',
    options: [
      { id: 'a', text: '6' },
      { id: 'b', text: '10' },
      { id: 'c', text: '14' },
      { id: 'd', text: '2' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'l=2 corresponds to d-subshell',
        'Maximum electrons = 2(2l+1)',
        '= 2(2×2+1) = 2×5 = 10'
      ],
      explanation: 'd-subshell can hold maximum 10 electrons.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-002',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Atomic Structure',
    topic: 'Electronic Configuration',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'The electronic configuration of Fe²⁺ (Z=26) is:',
    options: [
      { id: 'a', text: '[Ar]3d⁶' },
      { id: 'b', text: '[Ar]3d⁵4s¹' },
      { id: 'c', text: '[Ar]3d⁴4s²' },
      { id: 'd', text: '[Ar]3d⁸' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'Fe: [Ar]3d⁶4s²',
        'Fe²⁺ loses 2 electrons from 4s first',
        'Fe²⁺: [Ar]3d⁶'
      ],
      explanation: 'In cations, electrons are removed from outermost shell (4s) first.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-003',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Atomic Structure',
    topic: 'Bohr Model',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Energy of electron in nth orbit of hydrogen is -13.6/n² eV. Energy required to excite from n=1 to n=4 is:',
    options: [
      { id: 'a', text: '10.2 eV' },
      { id: 'b', text: '12.75 eV' },
      { id: 'c', text: '13.6 eV' },
      { id: 'd', text: '12.1 eV' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'E1 = -13.6/1² = -13.6 eV',
        'E4 = -13.6/16 = -0.85 eV',
        'Energy required = E4 - E1 = -0.85 - (-13.6) = 12.75 eV'
      ],
      explanation: 'Energy for excitation is difference between final and initial energy levels.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-004',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Atomic Structure',
    topic: 'Heisenberg Principle',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'According to Heisenberg uncertainty principle:',
    options: [
      { id: 'a', text: 'Position and momentum can be determined exactly simultaneously' },
      { id: 'b', text: 'Δx × Δp ≥ h/4π' },
      { id: 'c', text: 'Energy is quantized' },
      { id: 'd', text: 'Electrons have wave nature' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Heisenberg uncertainty principle:',
        'Δx × Δp ≥ ℏ/2 = h/4π',
        'Cannot determine position and momentum simultaneously with arbitrary precision'
      ],
      explanation: 'The product of uncertainties in position and momentum has a minimum value.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // PERIODIC TABLE (4 questions)
  {
    questionId: 'CHM-005',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Periodic Table',
    topic: 'Periodic Trends',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Across a period from left to right, atomic radius:',
    options: [
      { id: 'a', text: 'Increases' },
      { id: 'b', text: 'Decreases' },
      { id: 'c', text: 'Remains constant' },
      { id: 'd', text: 'First increases then decreases' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Across period: protons increase',
        'Electrons added to same shell',
        'Effective nuclear charge increases',
        'Electrons pulled closer → radius decreases'
      ],
      explanation: 'Increased nuclear charge contracts the electron cloud.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-006',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Periodic Table',
    topic: 'Ionization Energy',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'First ionization energy of N is greater than O because:',
    options: [
      { id: 'a', text: 'N has more protons' },
      { id: 'b', text: 'N has half-filled stable 2p subshell' },
      { id: 'c', text: 'O has larger size' },
      { id: 'd', text: 'O has more electrons' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'N: 1s²2s²2p³ (half-filled p)',
        'O: 1s²2s²2p⁴',
        'Half-filled configuration is extra stable',
        'Removing electron from N needs more energy'
      ],
      explanation: 'Extra stability of half-filled subshell increases ionization energy.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-007',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Periodic Table',
    topic: 'Electron Affinity',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Which has the highest electron affinity?',
    options: [
      { id: 'a', text: 'F' },
      { id: 'b', text: 'Cl' },
      { id: 'c', text: 'Br' },
      { id: 'd', text: 'I' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Cl has highest electron affinity',
        'F is small, so added electron faces repulsion',
        'Cl has optimal size for electron addition',
        'EA: Cl > F > Br > I'
      ],
      explanation: 'Cl has highest EA due to optimal size and nuclear charge.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-008',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Periodic Table',
    topic: 'Electronegativity',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Most electronegative element is:',
    options: [
      { id: 'a', text: 'Oxygen' },
      { id: 'b', text: 'Nitrogen' },
      { id: 'c', text: 'Fluorine' },
      { id: 'd', text: 'Chlorine' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Electronegativity increases across period',
        'Electronegativity decreases down group',
        'F is top-right in periodic table',
        'F has highest electronegativity (4.0)'
      ],
      explanation: 'Fluorine has the highest electronegativity of all elements.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // CHEMICAL BONDING (4 questions)
  {
    questionId: 'CHM-009',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Chemical Bonding',
    topic: 'VSEPR Theory',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Shape of ammonia (NH₃) molecule is:',
    options: [
      { id: 'a', text: 'Planar' },
      { id: 'b', text: 'Trigonal pyramidal' },
      { id: 'c', text: 'Tetrahedral' },
      { id: 'd', text: 'Linear' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'N has 5 valence electrons',
        '3 bond pairs + 1 lone pair',
        'Electron geometry: tetrahedral',
        'Molecular shape: trigonal pyramidal'
      ],
      explanation: 'Lone pair on N distorts tetrahedral to pyramidal.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-010',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Chemical Bonding',
    topic: 'Hybridization',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Hybridization of carbon in ethyne (C₂H₂) is:',
    options: [
      { id: 'a', text: 'sp³' },
      { id: 'b', text: 'sp²' },
      { id: 'c', text: 'sp' },
      { id: 'd', text: 'sp³d' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Ethyne: H-C≡C-H',
        'Each C has 2 sigma bonds (1 H + 1 C)',
        '2 sigma bonds → sp hybridization',
        'Linear geometry'
      ],
      explanation: 'Triple bond means sp hybridization with linear geometry.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-011',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Chemical Bonding',
    topic: 'Molecular Orbital Theory',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Bond order of O₂ molecule is:',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: '1.5' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'O₂: σ1s² σ*1s² σ2s² σ*2s² σ2p² π2p⁴ π*2p²',
        'Bonding electrons = 10',
        'Antibonding electrons = 6',
        'Bond order = (10-6)/2 = 2'
      ],
      explanation: 'Bond order = (bonding - antibonding)/2.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-012',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Chemical Bonding',
    topic: 'Hydrogen Bonding',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Which compound shows intermolecular hydrogen bonding?',
    options: [
      { id: 'a', text: 'CH₄' },
      { id: 'b', text: 'H₂O' },
      { id: 'c', text: 'CO₂' },
      { id: 'd', text: 'CCl₄' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'H-bonding needs H bonded to F, O, or N',
        'H₂O has O-H bonds',
        'O is highly electronegative',
        'H₂O shows strong H-bonding'
      ],
      explanation: 'Water forms hydrogen bonds between molecules.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // THERMODYNAMICS (4 questions)
  {
    questionId: 'CHM-013',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Thermodynamics',
    topic: 'Enthalpy',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'For an exothermic reaction:',
    options: [
      { id: 'a', text: 'ΔH > 0' },
      { id: 'b', text: 'ΔH < 0' },
      { id: 'c', text: 'ΔH = 0' },
      { id: 'd', text: 'ΔH is undefined' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Exothermic = heat released',
        'Products have lower energy than reactants',
        'ΔH = Hproducts - Hreactants < 0'
      ],
      explanation: 'Negative ΔH indicates heat is released to surroundings.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-014',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Thermodynamics',
    topic: 'Entropy',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'For the process H₂O(l) → H₂O(g), ΔS is:',
    options: [
      { id: 'a', text: 'Positive' },
      { id: 'b', text: 'Negative' },
      { id: 'c', text: 'Zero' },
      { id: 'd', text: 'Cannot be predicted' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'Liquid → Gas transition',
        'Gas has more disorder than liquid',
        'Entropy (disorder) increases',
        'ΔS > 0'
      ],
      explanation: 'Vaporization always increases entropy.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-015',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Thermodynamics',
    topic: 'Gibbs Energy',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'A reaction is spontaneous when:',
    options: [
      { id: 'a', text: 'ΔG > 0' },
      { id: 'b', text: 'ΔG = 0' },
      { id: 'c', text: 'ΔG < 0' },
      { id: 'd', text: 'ΔS < 0' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'ΔG = ΔH - TΔS',
        'For spontaneous process, ΔG < 0',
        'System tends to minimum free energy'
      ],
      explanation: 'Negative Gibbs energy change indicates spontaneity.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-016',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Thermodynamics',
    topic: 'Hess Law',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'According to Hess law, enthalpy change:',
    options: [
      { id: 'a', text: 'Depends on path' },
      { id: 'b', text: 'Depends only on initial and final states' },
      { id: 'c', text: 'Is always positive' },
      { id: 'd', text: 'Is always negative' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Enthalpy is a state function',
        'Hess law: ΔH is path independent',
        'Total ΔH = sum of ΔH of intermediate steps'
      ],
      explanation: 'Enthalpy change depends only on initial and final states, not path.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // EQUILIBRIUM (4 questions)
  {
    questionId: 'CHM-017',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Equilibrium',
    topic: 'Equilibrium Constant',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'For reaction A + B ⇌ C + D, if Kc = 100, the reaction:',
    options: [
      { id: 'a', text: 'Favors reactants' },
      { id: 'b', text: 'Favors products' },
      { id: 'c', text: 'Is at equilibrium' },
      { id: 'd', text: 'Does not proceed' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Kc = [C][D]/[A][B]',
        'Kc = 100 means products >> reactants at equilibrium',
        'Reaction favors product formation'
      ],
      explanation: 'Large Kc means equilibrium lies towards products.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-018',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Equilibrium',
    topic: 'Le Chatelier Principle',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'For N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + heat, increasing pressure will:',
    options: [
      { id: 'a', text: 'Shift equilibrium to left' },
      { id: 'b', text: 'Shift equilibrium to right' },
      { id: 'c', text: 'No effect on equilibrium' },
      { id: 'd', text: 'Increase temperature' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Left side: 1+3 = 4 moles gas',
        'Right side: 2 moles gas',
        'Pressure increase favors fewer moles',
        'Equilibrium shifts right (towards NH₃)'
      ],
      explanation: 'Higher pressure favors the side with fewer gas molecules.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-019',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Equilibrium',
    topic: 'pH Scale',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'pH of 0.01 M HCl solution is:',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: '4' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'HCl is strong acid, fully dissociates',
        '[H⁺] = 0.01 M = 10⁻² M',
        'pH = -log[H⁺] = -log(10⁻²) = 2'
      ],
      explanation: 'pH = -log[H⁺] for strong acid solutions.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-020',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Equilibrium',
    topic: 'Buffer Solutions',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'A buffer solution contains:',
    options: [
      { id: 'a', text: 'Strong acid and strong base' },
      { id: 'b', text: 'Weak acid and its conjugate base' },
      { id: 'c', text: 'Only weak acid' },
      { id: 'd', text: 'Only strong acid' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Buffer resists pH change',
        'Contains weak acid + conjugate base',
        'Or weak base + conjugate acid',
        'Examples: CH₃COOH + CH₃COONa'
      ],
      explanation: 'Buffer solution contains weak acid/base with its conjugate.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // ELECTROCHEMISTRY (4 questions)
  {
    questionId: 'CHM-021',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Electrochemistry',
    topic: 'Faraday Laws',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'During electrolysis, mass deposited is proportional to:',
    options: [
      { id: 'a', text: 'Current only' },
      { id: 'b', text: 'Time only' },
      { id: 'c', text: 'Quantity of electricity passed' },
      { id: 'd', text: 'Voltage applied' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'First law: m ∝ Q (charge)',
        'Q = It (current × time)',
        'm ∝ It'
      ],
      explanation: 'Mass deposited is proportional to total charge passed.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-022',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Electrochemistry',
    topic: 'Standard Electrode Potential',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Standard hydrogen electrode has potential:',
    options: [
      { id: 'a', text: '1 V' },
      { id: 'b', text: '-1 V' },
      { id: 'c', text: '0 V' },
      { id: 'd', text: '0.5 V' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'SHE is the reference electrode',
        'By convention, E° of SHE = 0 V',
        'All other potentials measured relative to SHE'
      ],
      explanation: 'SHE potential is defined as zero by convention.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-023',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Electrochemistry',
    topic: 'Galvanic Cell',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'In a galvanic cell, oxidation occurs at:',
    options: [
      { id: 'a', text: 'Cathode' },
      { id: 'b', text: 'Anode' },
      { id: 'c', text: 'Both electrodes' },
      { id: 'd', text: 'Salt bridge' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Anode: oxidation (loss of electrons)',
        'Cathode: reduction (gain of electrons)',
        'Mnemonic: An Ox, Red Cat'
      ],
      explanation: 'Oxidation always occurs at anode in any electrochemical cell.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-024',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Electrochemistry',
    topic: 'Conductance',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Molar conductivity of strong electrolyte at infinite dilution can be calculated using:',
    options: [
      { id: 'a', text: 'Arrhenius equation' },
      { id: 'b', text: 'Kohlrausch law' },
      { id: 'c', text: 'Faraday law' },
      { id: 'd', text: 'Nernst equation' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Kohlrausch law of independent migration',
        'Λ°m = λ°cation + λ°anion',
        'Each ion contributes independently'
      ],
      explanation: 'Kohlrausch law helps calculate limiting molar conductivity.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // ORGANIC CHEMISTRY (4 questions)
  {
    questionId: 'CHM-025',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Organic Chemistry',
    topic: 'IUPAC Nomenclature',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'IUPAC name of CH₃-CH=CH-CH₃ is:',
    options: [
      { id: 'a', text: '2-butene' },
      { id: 'b', text: '1-butene' },
      { id: 'c', text: 'But-2-ene' },
      { id: 'd', text: 'But-1-ene' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        '4 carbon chain = butene',
        'Double bond at C2-C3',
        'IUPAC name: but-2-ene'
      ],
      explanation: 'Double bond position indicated by lowest possible number.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-026',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Organic Chemistry',
    topic: 'Isomerism',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Number of structural isomers of C₄H₁₀ is:',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: '4' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'C₄H₁₀ is butane',
        'Isomer 1: n-butane (straight chain)',
        'Isomer 2: isobutane (branched)',
        'Total: 2 isomers'
      ],
      explanation: 'Butane has 2 structural isomers: normal and iso.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-027',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Organic Chemistry',
    topic: 'Reaction Mechanism',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'SN1 reaction proceeds through:',
    options: [
      { id: 'a', text: 'Carbocation intermediate' },
      { id: 'b', text: 'Carbanion intermediate' },
      { id: 'c', text: 'Free radical intermediate' },
      { id: 'd', text: 'No intermediate' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'SN1: Substitution Nucleophilic Unimolecular',
        'Step 1: Leaving group leaves → carbocation',
        'Step 2: Nucleophile attacks carbocation',
        'Rate depends only on substrate'
      ],
      explanation: 'SN1 has carbocation intermediate and unimolecular rate determining step.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-028',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Organic Chemistry',
    topic: 'Functional Groups',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Functional group in aldehydes is:',
    options: [
      { id: 'a', text: '-OH' },
      { id: 'b', text: '-CHO' },
      { id: 'c', text: '-COOH' },
      { id: 'd', text: '-CO-' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Aldehyde: R-CHO',
        '-CHO is aldehyde group',
        'Carbonyl at end of carbon chain'
      ],
      explanation: 'Aldehydes have -CHO (formyl) functional group.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // POLYMERS (4 questions)
  {
    questionId: 'CHM-029',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Polymers',
    topic: 'Addition Polymers',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Polyethylene is formed by polymerization of:',
    options: [
      { id: 'a', text: 'Ethane' },
      { id: 'b', text: 'Ethene' },
      { id: 'c', text: 'Ethyne' },
      { id: 'd', text: 'Ethanol' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'nCH₂=CH₂ → (-CH₂-CH₂-)n',
        'Ethene (ethylene) undergoes addition',
        'Forms polyethylene'
      ],
      explanation: 'Polyethylene is addition polymer of ethene monomers.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-030',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Polymers',
    topic: 'Condensation Polymers',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Nylon-6,6 is formed from:',
    options: [
      { id: 'a', text: 'Hexamethylenediamine and adipic acid' },
      { id: 'b', text: 'Caprolactam' },
      { id: 'c', text: 'Phenol and formaldehyde' },
      { id: 'd', text: 'Styrene' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'Nylon-6,6: condensation polymer',
        'Monomer 1: Hexamethylenediamine (6C)',
        'Monomer 2: Adipic acid (6C)',
        '6,6 refers to 6 carbons in each monomer'
      ],
      explanation: 'Nylon-6,6 is made from two 6-carbon monomers.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-031',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Polymers',
    topic: 'Natural Polymers',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Starch and cellulose are polymers of:',
    options: [
      { id: 'a', text: 'Fructose' },
      { id: 'b', text: 'Glucose' },
      { id: 'c', text: 'Sucrose' },
      { id: 'd', text: 'Galactose' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Starch: polymer of α-glucose',
        'Cellulose: polymer of β-glucose',
        'Both are polysaccharides of glucose'
      ],
      explanation: 'Different glycosidic linkages give different properties.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-032',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Polymers',
    topic: 'Rubber',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Vulcanization of rubber involves:',
    options: [
      { id: 'a', text: 'Adding carbon black' },
      { id: 'b', text: 'Cross-linking with sulfur' },
      { id: 'c', text: 'Heating without additives' },
      { id: 'd', text: 'Adding plasticizers' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Vulcanization: heating rubber with sulfur',
        'Sulfur creates cross-links between chains',
        'Improves hardness and elasticity'
      ],
      explanation: 'Sulfur cross-links make vulcanized rubber stronger.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // BIOMOLECULES (4 questions)
  {
    questionId: 'CHM-033',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Biomolecules',
    topic: 'Carbohydrates',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Sucrose is a:',
    options: [
      { id: 'a', text: 'Monosaccharide' },
      { id: 'b', text: 'Disaccharide' },
      { id: 'c', text: 'Polysaccharide' },
      { id: 'd', text: 'Amino acid' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Sucrose = glucose + fructose',
        'Two monosaccharide units',
        'Therefore, disaccharide'
      ],
      explanation: 'Sucrose is formed by glycosidic bond between glucose and fructose.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-034',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Biomolecules',
    topic: 'Proteins',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Peptide bond is formed between:',
    options: [
      { id: 'a', text: '-COOH and -NH₂ groups' },
      { id: 'b', text: '-OH and -NH₂ groups' },
      { id: 'c', text: '-COOH and -SH groups' },
      { id: 'd', text: '-OH and -COOH groups' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'Peptide bond: -CO-NH-',
        'Formed by condensation of -COOH and -NH₂',
        'Water molecule is eliminated'
      ],
      explanation: 'Peptide bond links amino acids in proteins.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-035',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Biomolecules',
    topic: 'Nucleic Acids',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'In DNA, adenine pairs with:',
    options: [
      { id: 'a', text: 'Guanine' },
      { id: 'b', text: 'Cytosine' },
      { id: 'c', text: 'Thymine' },
      { id: 'd', text: 'Uracil' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Watson-Crick base pairing',
        'A pairs with T (2 H-bonds)',
        'G pairs with C (3 H-bonds)'
      ],
      explanation: 'Complementary base pairing: A-T and G-C in DNA.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-036',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Biomolecules',
    topic: 'Vitamins',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Vitamin C is also known as:',
    options: [
      { id: 'a', text: 'Retinol' },
      { id: 'b', text: 'Ascorbic acid' },
      { id: 'c', text: 'Calciferol' },
      { id: 'd', text: 'Tocopherol' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Vitamin C = Ascorbic acid',
        'Water-soluble vitamin',
        'Deficiency causes scurvy'
      ],
      explanation: 'Vitamin C (ascorbic acid) is essential for collagen synthesis.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // KINETICS (4 questions)
  {
    questionId: 'CHM-037',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Kinetics',
    topic: 'Rate of Reaction',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Rate of reaction depends on:',
    options: [
      { id: 'a', text: 'Concentration of products' },
      { id: 'b', text: 'Concentration of reactants' },
      { id: 'c', text: 'Total mass of reactants' },
      { id: 'd', text: 'Volume of container' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Rate = k[A]ᵐ[B]ⁿ',
        'Rate depends on reactant concentrations',
        'Higher concentration = more collisions = faster rate'
      ],
      explanation: 'Rate law expresses dependence on reactant concentrations.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-038',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Kinetics',
    topic: 'Order of Reaction',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'For a first-order reaction, half-life is:',
    options: [
      { id: 'a', text: 'Dependent on initial concentration' },
      { id: 'b', text: 'Independent of initial concentration' },
      { id: 'c', text: 'Proportional to concentration' },
      { id: 'd', text: 'Inversely proportional to concentration' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'For first-order: t₁/₂ = 0.693/k',
        'Half-life depends only on rate constant',
        'Independent of initial concentration'
      ],
      explanation: 'First-order half-life is constant and equals 0.693/k.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-039',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Kinetics',
    topic: 'Arrhenius Equation',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'According to Arrhenius equation, rate constant increases with:',
    options: [
      { id: 'a', text: 'Decrease in temperature' },
      { id: 'b', text: 'Increase in temperature' },
      { id: 'c', text: 'Increase in concentration' },
      { id: 'd', text: 'Decrease in activation energy only' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'k = Ae^(-Ea/RT)',
        'Higher T → larger e^(-Ea/RT)',
        'Rate constant increases with temperature'
      ],
      explanation: 'Arrhenius equation shows exponential increase of k with T.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'CHM-040',
    exam: 'JEE',
    subject: 'chemistry',
    chapter: 'Kinetics',
    topic: 'Catalyst',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'A catalyst increases reaction rate by:',
    options: [
      { id: 'a', text: 'Increasing temperature' },
      { id: 'b', text: 'Increasing pressure' },
      { id: 'c', text: 'Providing alternative pathway with lower Ea' },
      { id: 'd', text: 'Increasing concentration of reactants' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Catalyst provides new reaction mechanism',
        'New pathway has lower activation energy',
        'More molecules can overcome barrier',
        'Rate increases without changing equilibrium'
      ],
      explanation: 'Catalysts work by lowering activation energy.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // ============================================================================
  // MATHEMATICS (40 Questions) - JEE Exam
  // ============================================================================

  // LIMITS (4 questions)
  {
    questionId: 'MAT-001',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Limits',
    topic: 'Standard Limits',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'lim(x→0) (sin 5x)/x equals:',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1' },
      { id: 'c', text: '5' },
      { id: 'd', text: '1/5' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'lim(x→0) (sin 5x)/x',
        '= lim(x→0) 5 × (sin 5x)/(5x)',
        '= 5 × 1 = 5'
      ],
      explanation: 'Use standard limit: lim(θ→0) sinθ/θ = 1'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-002',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Limits',
    topic: 'L Hospital Rule',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'lim(x→0) (eˣ - 1)/x equals:',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1' },
      { id: 'c', text: 'e' },
      { id: 'd', text: '∞' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'This is 0/0 form',
        'Using L Hospital: d/dx(eˣ-1)/d/dx(x) = eˣ/1',
        'At x=0: e⁰ = 1'
      ],
      explanation: 'Standard limit: lim(x→0) (eˣ-1)/x = 1'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-003',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Limits',
    topic: 'Limits at Infinity',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'lim(x→∞) (1 + 1/x)ˣ equals:',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '0' },
      { id: 'c', text: 'e' },
      { id: 'd', text: '∞' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'This is the definition of e',
        'lim(x→∞) (1 + 1/x)ˣ = e'
      ],
      explanation: 'This is one of the fundamental limits defining Euler number e.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-004',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Limits',
    topic: 'Continuity',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'For a function to be continuous at x=a, which condition must hold?',
    options: [
      { id: 'a', text: 'f(a) must exist' },
      { id: 'b', text: 'lim(x→a) f(x) must exist' },
      { id: 'c', text: 'lim(x→a) f(x) = f(a)' },
      { id: 'd', text: 'All of the above' }
    ],
    correctAnswer: 'd',
    solution: {
      steps: [
        'Continuity at x=a requires:',
        '1. f(a) is defined',
        '2. lim(x→a) f(x) exists',
        '3. lim(x→a) f(x) = f(a)'
      ],
      explanation: 'All three conditions must be satisfied for continuity.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // DIFFERENTIATION (4 questions)
  {
    questionId: 'MAT-005',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Differentiation',
    topic: 'Basic Derivatives',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'd/dx(sin x) equals:',
    options: [
      { id: 'a', text: '-sin x' },
      { id: 'b', text: 'cos x' },
      { id: 'c', text: '-cos x' },
      { id: 'd', text: 'tan x' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'd/dx(sin x) = cos x',
        'Standard derivative formula'
      ],
      explanation: 'Derivative of sine is cosine.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-006',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Differentiation',
    topic: 'Chain Rule',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'd/dx(e^(3x)) equals:',
    options: [
      { id: 'a', text: 'e^(3x)' },
      { id: 'b', text: '3e^(3x)' },
      { id: 'c', text: 'e^(3x)/3' },
      { id: 'd', text: '3e^x' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Let u = 3x, then y = eᵘ',
        'dy/dx = dy/du × du/dx',
        '= eᵘ × 3 = 3e^(3x)'
      ],
      explanation: 'Apply chain rule: derivative of outer × derivative of inner.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-007',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Differentiation',
    topic: 'Product Rule',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'd/dx(x²·sin x) equals:',
    options: [
      { id: 'a', text: '2x·sin x + x²·cos x' },
      { id: 'b', text: '2x·cos x' },
      { id: 'c', text: 'x²·cos x' },
      { id: 'd', text: '2x·sin x - x²·cos x' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'Using product rule: d/dx(uv) = u dv + v du',
        'u = x², v = sin x',
        'd/dx = x²·cos x + sin x·2x'
      ],
      explanation: 'Product rule: derivative of first × second + first × derivative of second.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-008',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Differentiation',
    topic: 'Implicit Differentiation',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'If x² + y² = 25, then dy/dx at (3,4) is:',
    options: [
      { id: 'a', text: '3/4' },
      { id: 'b', text: '-3/4' },
      { id: 'c', text: '4/3' },
      { id: 'd', text: '-4/3' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Differentiating: 2x + 2y(dy/dx) = 0',
        'dy/dx = -x/y',
        'At (3,4): dy/dx = -3/4'
      ],
      explanation: 'Implicit differentiation: differentiate both sides, solve for dy/dx.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // INTEGRATION (4 questions)
  {
    questionId: 'MAT-009',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Integration',
    topic: 'Basic Integrals',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: '∫cos x dx equals:',
    options: [
      { id: 'a', text: '-sin x + C' },
      { id: 'b', text: 'sin x + C' },
      { id: 'c', text: 'cos x + C' },
      { id: 'd', text: '-cos x + C' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        '∫cos x dx = sin x + C',
        'Antiderivative of cosine is sine'
      ],
      explanation: 'Standard integral formula.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-010',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Integration',
    topic: 'Definite Integrals',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: '∫₀^π sin x dx equals:',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1' },
      { id: 'c', text: '2' },
      { id: 'd', text: 'π' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        '∫sin x dx = -cos x',
        '[-cos x]₀^π = -cos π - (-cos 0)',
        '= -(-1) - (-1) = 1 + 1 = 2'
      ],
      explanation: 'Evaluate antiderivative at limits and subtract.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-011',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Integration',
    topic: 'Integration by Substitution',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: '∫2x·e^(x²) dx equals:',
    options: [
      { id: 'a', text: 'e^(x²) + C' },
      { id: 'b', text: '2e^(x²) + C' },
      { id: 'c', text: 'x·e^(x²) + C' },
      { id: 'd', text: 'e^(2x) + C' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'Let u = x², then du = 2x dx',
        '∫e^u du = e^u + C',
        '= e^(x²) + C'
      ],
      explanation: 'Substitution makes this a simple exponential integral.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-012',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Integration',
    topic: 'Area Under Curve',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Area under y = x² from x=0 to x=2 is:',
    options: [
      { id: 'a', text: '4/3' },
      { id: 'b', text: '8/3' },
      { id: 'c', text: '2' },
      { id: 'd', text: '4' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Area = ∫₀² x² dx',
        '= [x³/3]₀²',
        '= 8/3 - 0 = 8/3'
      ],
      explanation: 'Area under curve is definite integral.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // COORDINATE GEOMETRY (4 questions)
  {
    questionId: 'MAT-013',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Coordinate Geometry',
    topic: 'Straight Lines',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Slope of line passing through (1,2) and (3,6) is:',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: '4' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'm = (y₂-y₁)/(x₂-x₁)',
        'm = (6-2)/(3-1) = 4/2 = 2'
      ],
      explanation: 'Slope formula: change in y over change in x.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-014',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Coordinate Geometry',
    topic: 'Circle',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Center of circle x² + y² - 4x + 6y - 12 = 0 is:',
    options: [
      { id: 'a', text: '(2, -3)' },
      { id: 'b', text: '(-2, 3)' },
      { id: 'c', text: '(4, -6)' },
      { id: 'd', text: '(-4, 6)' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'Compare with x² + y² + 2gx + 2fy + c = 0',
        '2g = -4 → g = -2',
        '2f = 6 → f = 3',
        'Center = (-g, -f) = (2, -3)'
      ],
      explanation: 'Center of circle is (-g, -f) from standard form.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-015',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Coordinate Geometry',
    topic: 'Parabola',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Equation of directrix of parabola y² = 8x is:',
    options: [
      { id: 'a', text: 'x = 2' },
      { id: 'b', text: 'x = -2' },
      { id: 'c', text: 'y = 2' },
      { id: 'd', text: 'y = -2' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'y² = 8x → y² = 4ax where 4a = 8',
        'a = 2',
        'Directrix: x = -a = -2'
      ],
      explanation: 'For y² = 4ax, directrix is x = -a.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-016',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Coordinate Geometry',
    topic: 'Ellipse',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Eccentricity of ellipse x²/25 + y²/16 = 1 is:',
    options: [
      { id: 'a', text: '3/5' },
      { id: 'b', text: '4/5' },
      { id: 'c', text: '5/4' },
      { id: 'd', text: '3/4' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'a² = 25, b² = 16',
        'c² = a² - b² = 25 - 16 = 9',
        'c = 3',
        'e = c/a = 3/5'
      ],
      explanation: 'For ellipse, e = c/a where c² = a² - b².'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // VECTORS (4 questions)
  {
    questionId: 'MAT-017',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Vectors',
    topic: 'Vector Operations',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'If a = 2i + 3j and b = i - j, then a + b equals:',
    options: [
      { id: 'a', text: '3i + 2j' },
      { id: 'b', text: 'i + 4j' },
      { id: 'c', text: '3i + 4j' },
      { id: 'd', text: 'i + 2j' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'a + b = (2i + 3j) + (i - j)',
        '= (2+1)i + (3-1)j',
        '= 3i + 2j'
      ],
      explanation: 'Add corresponding components.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-018',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Vectors',
    topic: 'Dot Product',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'If |a| = 2, |b| = 3, and angle between them is 60°, then a·b equals:',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '6' },
      { id: 'c', text: '3√3' },
      { id: 'd', text: '6√3' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'a·b = |a||b|cos θ',
        '= 2 × 3 × cos 60°',
        '= 6 × 0.5 = 3'
      ],
      explanation: 'Dot product formula with angle between vectors.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-019',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Vectors',
    topic: 'Cross Product',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'If a = i + j and b = i - j, then |a × b| equals:',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1' },
      { id: 'c', text: '2' },
      { id: 'd', text: '√2' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'a × b = (i+j) × (i-j)',
        '= i×i - i×j + j×i - j×j',
        '= 0 - k - k - 0 = -2k',
        '|a × b| = 2'
      ],
      explanation: 'Use distributive property of cross product.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-020',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Vectors',
    topic: 'Unit Vector',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Unit vector in direction of a = 3i + 4j is:',
    options: [
      { id: 'a', text: '(3i + 4j)/5' },
      { id: 'b', text: '(3i + 4j)/7' },
      { id: 'c', text: '(3i + 4j)/25' },
      { id: 'd', text: '3i + 4j' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        '|a| = √(9+16) = √25 = 5',
        'Unit vector = a/|a| = (3i+4j)/5'
      ],
      explanation: 'Unit vector is vector divided by its magnitude.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // MATRICES (4 questions)
  {
    questionId: 'MAT-021',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Matrices',
    topic: 'Matrix Operations',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'If A is a 2×3 matrix and B is a 3×4 matrix, then AB is:',
    options: [
      { id: 'a', text: '2×4 matrix' },
      { id: 'b', text: '3×3 matrix' },
      { id: 'c', text: '2×3 matrix' },
      { id: 'd', text: 'Not possible' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'For multiplication: columns of A = rows of B ✓',
        '3 = 3',
        'Result: rows of A × columns of B',
        '= 2×4 matrix'
      ],
      explanation: 'Product of m×n and n×p matrices is m×p matrix.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-022',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Matrices',
    topic: 'Determinants',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Determinant of [[2, 3], [4, 5]] is:',
    options: [
      { id: 'a', text: '-2' },
      { id: 'b', text: '2' },
      { id: 'c', text: '10' },
      { id: 'd', text: '-10' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        '|A| = ad - bc',
        '= 2×5 - 3×4',
        '= 10 - 12 = -2'
      ],
      explanation: 'For 2×2 matrix, determinant = ad - bc.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-023',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Matrices',
    topic: 'Inverse Matrix',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'A matrix A is invertible if and only if:',
    options: [
      { id: 'a', text: 'det(A) = 0' },
      { id: 'b', text: 'det(A) ≠ 0' },
      { id: 'c', text: 'A is symmetric' },
      { id: 'd', text: 'A has all positive elements' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'A⁻¹ = adj(A)/det(A)',
        'For inverse to exist, det(A) ≠ 0',
        'Otherwise division by zero'
      ],
      explanation: 'Non-zero determinant is necessary and sufficient for invertibility.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-024',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Matrices',
    topic: 'Transpose',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'If A is a 3×2 matrix, then Aᵀ is:',
    options: [
      { id: 'a', text: '3×2 matrix' },
      { id: 'b', text: '2×3 matrix' },
      { id: 'c', text: '2×2 matrix' },
      { id: 'd', text: '3×3 matrix' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Transpose interchanges rows and columns',
        '3×2 becomes 2×3'
      ],
      explanation: 'Transpose of m×n matrix is n×m matrix.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // PROBABILITY (4 questions)
  {
    questionId: 'MAT-025',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Probability',
    topic: 'Basic Probability',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Probability of getting head in a fair coin toss is:',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '0' },
      { id: 'c', text: '1/2' },
      { id: 'd', text: '1/4' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Total outcomes = 2 (H, T)',
        'Favorable outcomes = 1 (H)',
        'P(H) = 1/2'
      ],
      explanation: 'Equal probability for both outcomes in fair coin.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-026',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Probability',
    topic: 'Addition Rule',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'If P(A) = 0.4, P(B) = 0.3, P(A∩B) = 0.1, then P(A∪B) is:',
    options: [
      { id: 'a', text: '0.5' },
      { id: 'b', text: '0.6' },
      { id: 'c', text: '0.7' },
      { id: 'd', text: '0.8' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'P(A∪B) = P(A) + P(B) - P(A∩B)',
        '= 0.4 + 0.3 - 0.1',
        '= 0.6'
      ],
      explanation: 'Addition rule for probability of union.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-027',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Probability',
    topic: 'Conditional Probability',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'If P(A) = 0.5, P(B) = 0.4, P(A|B) = 0.5, then P(A∩B) is:',
    options: [
      { id: 'a', text: '0.1' },
      { id: 'b', text: '0.2' },
      { id: 'c', text: '0.25' },
      { id: 'd', text: '0.5' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'P(A|B) = P(A∩B)/P(B)',
        '0.5 = P(A∩B)/0.4',
        'P(A∩B) = 0.5 × 0.4 = 0.2'
      ],
      explanation: 'Conditional probability formula rearranged.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-028',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Probability',
    topic: 'Binomial Distribution',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'In 5 tosses of a fair coin, probability of exactly 3 heads is:',
    options: [
      { id: 'a', text: '5/16' },
      { id: 'b', text: '10/32' },
      { id: 'c', text: '1/4' },
      { id: 'd', text: '3/8' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'P = C(5,3) × (1/2)³ × (1/2)²',
        '= 10 × 1/8 × 1/4',
        '= 10/32 = 5/16'
      ],
      explanation: 'Use binomial probability formula: C(n,r)p^r q^(n-r).'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // COMPLEX NUMBERS (4 questions)
  {
    questionId: 'MAT-029',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Complex Numbers',
    topic: 'Basic Operations',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Value of i⁴ is:',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '-1' },
      { id: 'c', text: 'i' },
      { id: 'd', text: '-i' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'i² = -1',
        'i⁴ = (i²)² = (-1)² = 1'
      ],
      explanation: 'Powers of i cycle: i, -1, -i, 1, i, ...'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-030',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Complex Numbers',
    topic: 'Modulus',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Modulus of z = 3 + 4i is:',
    options: [
      { id: 'a', text: '7' },
      { id: 'b', text: '5' },
      { id: 'c', text: '25' },
      { id: 'd', text: '1' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        '|z| = √(a² + b²)',
        '= √(9 + 16)',
        '= √25 = 5'
      ],
      explanation: 'Modulus is distance from origin in complex plane.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-031',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Complex Numbers',
    topic: 'Conjugate',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Conjugate of z = 2 - 3i is:',
    options: [
      { id: 'a', text: '2 + 3i' },
      { id: 'b', text: '-2 + 3i' },
      { id: 'c', text: '-2 - 3i' },
      { id: 'd', text: '3 - 2i' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'Conjugate: change sign of imaginary part',
        'z̄ = 2 + 3i'
      ],
      explanation: 'Conjugate of a + bi is a - bi (or vice versa).'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-032',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Complex Numbers',
    topic: 'Euler Form',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'e^(iπ) + 1 equals:',
    options: [
      { id: 'a', text: '2' },
      { id: 'b', text: '0' },
      { id: 'c', text: '-2' },
      { id: 'd', text: 'i' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Euler formula: e^(iθ) = cos θ + i sin θ',
        'e^(iπ) = cos π + i sin π = -1 + 0i = -1',
        'e^(iπ) + 1 = -1 + 1 = 0'
      ],
      explanation: 'Euler identity is often called the most beautiful equation.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // SEQUENCES AND SERIES (4 questions)
  {
    questionId: 'MAT-033',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Sequences',
    topic: 'Arithmetic Progression',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: '10th term of AP: 2, 5, 8, 11, ... is:',
    options: [
      { id: 'a', text: '29' },
      { id: 'b', text: '32' },
      { id: 'c', text: '26' },
      { id: 'd', text: '35' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'a = 2, d = 3',
        'aₙ = a + (n-1)d',
        'a₁₀ = 2 + 9×3 = 2 + 27 = 29'
      ],
      explanation: 'nth term of AP: a + (n-1)d.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-034',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Sequences',
    topic: 'Geometric Progression',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Sum of infinite GP: 1 + 1/2 + 1/4 + ... is:',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: '∞' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'a = 1, r = 1/2',
        'S∞ = a/(1-r) = 1/(1-1/2)',
        '= 1/(1/2) = 2'
      ],
      explanation: 'Sum of infinite GP with |r| < 1 is a/(1-r).'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-035',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Sequences',
    topic: 'Sum of AP',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Sum of first 20 terms of AP: 3, 7, 11, ... is:',
    options: [
      { id: 'a', text: '820' },
      { id: 'b', text: '780' },
      { id: 'c', text: '860' },
      { id: 'd', text: '800' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'a = 3, d = 4, n = 20',
        'Sₙ = n/2[2a + (n-1)d]',
        'S₂₀ = 20/2[6 + 19×4]',
        '= 10[6 + 76] = 10×82 = 820'
      ],
      explanation: 'Sum formula for AP: n/2[2a + (n-1)d].'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-036',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Sequences',
    topic: 'Harmonic Progression',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'If 1/a, 1/b, 1/c are in AP, then a, b, c are in:',
    options: [
      { id: 'a', text: 'AP' },
      { id: 'b', text: 'GP' },
      { id: 'c', text: 'HP' },
      { id: 'd', text: 'None' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'By definition of HP:',
        'a, b, c are in HP if 1/a, 1/b, 1/c are in AP'
      ],
      explanation: 'Harmonic progression is reciprocal of arithmetic progression.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // TRIGONOMETRY (4 questions)
  {
    questionId: 'MAT-037',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Trigonometry',
    topic: 'Basic Identities',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'sin²θ + cos²θ equals:',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1' },
      { id: 'c', text: '2' },
      { id: 'd', text: 'tan²θ' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Pythagorean identity',
        'sin²θ + cos²θ = 1 for all θ'
      ],
      explanation: 'Fundamental trigonometric identity from unit circle.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-038',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Trigonometry',
    topic: 'Compound Angles',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'sin(A+B) equals:',
    options: [
      { id: 'a', text: 'sinA + sinB' },
      { id: 'b', text: 'sinA cosB + cosA sinB' },
      { id: 'c', text: 'sinA cosB - cosA sinB' },
      { id: 'd', text: 'cosA cosB - sinA sinB' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Compound angle formula',
        'sin(A+B) = sinA cosB + cosA sinB'
      ],
      explanation: 'Standard compound angle formula for sine.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-039',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Trigonometry',
    topic: 'Inverse Trig',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'tan⁻¹(1) equals:',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: 'π/6' },
      { id: 'c', text: 'π/4' },
      { id: 'd', text: 'π/3' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'tan(π/4) = 1',
        'Therefore tan⁻¹(1) = π/4'
      ],
      explanation: 'Inverse tan of 1 is 45° or π/4 radians.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },
  {
    questionId: 'MAT-040',
    exam: 'JEE',
    subject: 'mathematics',
    chapter: 'Trigonometry',
    topic: 'Solution of Triangles',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'In triangle ABC, a/sinA equals:',
    options: [
      { id: 'a', text: 'b/sinB' },
      { id: 'b', text: '2R' },
      { id: 'c', text: 'Both (a) and (b)' },
      { id: 'd', text: 'None' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Sine rule: a/sinA = b/sinB = c/sinC',
        'Also equals 2R (circumradius)',
        'Both are correct'
      ],
      explanation: 'Sine rule relates sides, angles, and circumradius.'
    },
    source: 'JEE Mains Style',
    year: 2023
  },

  // ============================================================================
  // BIOLOGY (40 Questions) - NEET Exam
  // ============================================================================

  // CELL BIOLOGY (4 questions)
  {
    questionId: 'BIO-001',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Cell Biology',
    topic: 'Cell Organelles',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Which organelle is called the "powerhouse of the cell"?',
    options: [
      { id: 'a', text: 'Nucleus' },
      { id: 'b', text: 'Mitochondria' },
      { id: 'c', text: 'Golgi apparatus' },
      { id: 'd', text: 'Ribosome' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Mitochondria perform cellular respiration',
        'They produce ATP, the energy currency',
        'Hence called powerhouse of cell'
      ],
      explanation: 'Mitochondria generate most of the cell ATP through oxidative phosphorylation.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-002',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Cell Biology',
    topic: 'Cell Membrane',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'The fluid mosaic model of plasma membrane was proposed by:',
    options: [
      { id: 'a', text: 'Watson and Crick' },
      { id: 'b', text: 'Singer and Nicolson' },
      { id: 'c', text: 'Schleiden and Schwann' },
      { id: 'd', text: 'Robertson' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Singer and Nicolson (1972)',
        'Describes membrane as fluid lipid bilayer',
        'With proteins floating like mosaic'
      ],
      explanation: 'The fluid mosaic model is the currently accepted model of membrane structure.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-003',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Cell Biology',
    topic: 'Cell Division',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'During which phase of mitosis do chromosomes align at the equator?',
    options: [
      { id: 'a', text: 'Prophase' },
      { id: 'b', text: 'Metaphase' },
      { id: 'c', text: 'Anaphase' },
      { id: 'd', text: 'Telophase' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Metaphase: chromosomes align at metaphase plate',
        'Spindle fibers attach to kinetochores',
        'Chromosomes are maximally condensed'
      ],
      explanation: 'Metaphase is characterized by chromosome alignment at cell equator.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-004',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Cell Biology',
    topic: 'Endoplasmic Reticulum',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Rough ER is studded with:',
    options: [
      { id: 'a', text: 'Lysosomes' },
      { id: 'b', text: 'Ribosomes' },
      { id: 'c', text: 'Mitochondria' },
      { id: 'd', text: 'Peroxisomes' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Rough ER has ribosomes attached',
        'Ribosomes synthesize proteins',
        'Proteins enter ER for processing'
      ],
      explanation: 'Ribosomes on rough ER give it the "rough" appearance.'
    },
    source: 'NEET Style',
    year: 2023
  },

  // GENETICS (4 questions)
  {
    questionId: 'BIO-005',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Genetics',
    topic: 'Mendelian Genetics',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Phenotypic ratio of monohybrid cross F2 generation is:',
    options: [
      { id: 'a', text: '1:1' },
      { id: 'b', text: '1:2:1' },
      { id: 'c', text: '3:1' },
      { id: 'd', text: '9:3:3:1' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Monohybrid cross Aa × Aa',
        'F2: AA:Aa:aa = 1:2:1 (genotypic)',
        'Phenotypic: Dominant:Recessive = 3:1'
      ],
      explanation: 'Dominant phenotype appears in 3/4 of F2 offspring.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-006',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Genetics',
    topic: 'DNA Replication',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'DNA replication is:',
    options: [
      { id: 'a', text: 'Conservative' },
      { id: 'b', text: 'Semi-conservative' },
      { id: 'c', text: 'Dispersive' },
      { id: 'd', text: 'Non-conservative' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Meselson-Stahl experiment proved this',
        'Each new DNA has one old strand and one new strand',
        'Hence semi-conservative'
      ],
      explanation: 'Each daughter DNA molecule contains one parental strand.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-007',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Genetics',
    topic: 'Genetic Code',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'The codon AUG codes for:',
    options: [
      { id: 'a', text: 'Stop signal' },
      { id: 'b', text: 'Methionine and start' },
      { id: 'c', text: 'Tryptophan' },
      { id: 'd', text: 'Glycine' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'AUG is the start codon',
        'Also codes for methionine',
        'Translation begins here'
      ],
      explanation: 'AUG initiates translation and codes for methionine.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-008',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Genetics',
    topic: 'Sex-linked Inheritance',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Color blindness is a:',
    options: [
      { id: 'a', text: 'Y-linked trait' },
      { id: 'b', text: 'X-linked recessive trait' },
      { id: 'c', text: 'Autosomal dominant trait' },
      { id: 'd', text: 'Autosomal recessive trait' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Gene for color vision is on X chromosome',
        'Males (XY) express it if X carries defective gene',
        'Females need both X chromosomes affected'
      ],
      explanation: 'Color blindness is more common in males due to X-linkage.'
    },
    source: 'NEET Style',
    year: 2023
  },

  // PLANT PHYSIOLOGY (4 questions)
  {
    questionId: 'BIO-009',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Plant Physiology',
    topic: 'Photosynthesis',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'The primary pigment for photosynthesis is:',
    options: [
      { id: 'a', text: 'Chlorophyll a' },
      { id: 'b', text: 'Chlorophyll b' },
      { id: 'c', text: 'Carotenoids' },
      { id: 'd', text: 'Xanthophyll' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'Chlorophyll a is the primary pigment',
        'It directly participates in light reactions',
        'Other pigments are accessory pigments'
      ],
      explanation: 'Chlorophyll a is found in reaction centers of photosystems.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-010',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Plant Physiology',
    topic: 'Transpiration',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Transpiration pull is based on:',
    options: [
      { id: 'a', text: 'Root pressure' },
      { id: 'b', text: 'Cohesion-tension theory' },
      { id: 'c', text: 'Active transport' },
      { id: 'd', text: 'Osmosis only' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Dixon and Joly proposed cohesion-tension theory',
        'Water molecules cohere (stick together)',
        'Transpiration creates tension pulling water up'
      ],
      explanation: 'Cohesion of water molecules and tension from transpiration drives water up.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-011',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Plant Physiology',
    topic: 'Plant Hormones',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Which hormone promotes cell elongation and apical dominance?',
    options: [
      { id: 'a', text: 'Cytokinin' },
      { id: 'b', text: 'Auxin' },
      { id: 'c', text: 'Gibberellin' },
      { id: 'd', text: 'Ethylene' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Auxin (IAA) promotes cell elongation',
        'High auxin at apex inhibits lateral buds',
        'This is apical dominance'
      ],
      explanation: 'Auxin is the primary hormone for growth and tropisms.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-012',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Plant Physiology',
    topic: 'Mineral Nutrition',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Nitrogen fixation is carried out by:',
    options: [
      { id: 'a', text: 'Rhizobium' },
      { id: 'b', text: 'E. coli' },
      { id: 'c', text: 'Yeast' },
      { id: 'd', text: 'Amoeba' }
    ],
    correctAnswer: 'a',
    solution: {
      steps: [
        'Rhizobium lives in root nodules of legumes',
        'Contains nitrogenase enzyme',
        'Converts N2 to NH3'
      ],
      explanation: 'Rhizobium forms symbiotic relationship with legumes for nitrogen fixation.'
    },
    source: 'NEET Style',
    year: 2023
  },

  // HUMAN PHYSIOLOGY (4 questions)
  {
    questionId: 'BIO-013',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Human Physiology',
    topic: 'Digestion',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Digestion of starch begins in:',
    options: [
      { id: 'a', text: 'Stomach' },
      { id: 'b', text: 'Small intestine' },
      { id: 'c', text: 'Mouth' },
      { id: 'd', text: 'Large intestine' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Saliva contains salivary amylase',
        'Amylase breaks starch into maltose',
        'Digestion begins in mouth'
      ],
      explanation: 'Salivary amylase (ptyalin) initiates starch digestion in mouth.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-014',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Human Physiology',
    topic: 'Respiration',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Exchange of gases occurs in:',
    options: [
      { id: 'a', text: 'Bronchi' },
      { id: 'b', text: 'Bronchioles' },
      { id: 'c', text: 'Alveoli' },
      { id: 'd', text: 'Trachea' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Alveoli are the functional units of lungs',
        'Thin walls allow gas diffusion',
        'O2 in, CO2 out'
      ],
      explanation: 'Alveoli have thin walls and rich blood supply for gas exchange.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-015',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Human Physiology',
    topic: 'Circulation',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'The pacemaker of the heart is:',
    options: [
      { id: 'a', text: 'AV node' },
      { id: 'b', text: 'SA node' },
      { id: 'c', text: 'Bundle of His' },
      { id: 'd', text: 'Purkinje fibers' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'SA node (sinoatrial node) initiates heartbeat',
        'Located in right atrium',
        'Generates 70-75 impulses per minute'
      ],
      explanation: 'SA node sets the rhythm of heart, hence called pacemaker.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-016',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Human Physiology',
    topic: 'Excretion',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Functional unit of kidney is:',
    options: [
      { id: 'a', text: 'Neuron' },
      { id: 'b', text: 'Nephron' },
      { id: 'c', text: 'Glomerulus' },
      { id: 'd', text: 'Ureter' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Nephron filters blood and forms urine',
        'Each kidney has about 1 million nephrons',
        'Parts: glomerulus, tubules, collecting duct'
      ],
      explanation: 'Nephron is the structural and functional unit of kidney.'
    },
    source: 'NEET Style',
    year: 2023
  },

  // ECOLOGY (4 questions)
  {
    questionId: 'BIO-017',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Ecology',
    topic: 'Ecosystem',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Primary producers in an ecosystem are:',
    options: [
      { id: 'a', text: 'Herbivores' },
      { id: 'b', text: 'Carnivores' },
      { id: 'c', text: 'Autotrophs' },
      { id: 'd', text: 'Decomposers' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Autotrophs make their own food',
        'Plants use photosynthesis',
        'They form the base of food chains'
      ],
      explanation: 'Autotrophs (producers) convert solar energy to chemical energy.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-018',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Ecology',
    topic: 'Food Chain',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'According to 10% law, energy transfer between trophic levels is:',
    options: [
      { id: 'a', text: '1%' },
      { id: 'b', text: '10%' },
      { id: 'c', text: '50%' },
      { id: 'd', text: '90%' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Lindeman (1942) proposed 10% law',
        'Only 10% energy passes to next level',
        '90% is lost as heat'
      ],
      explanation: '10% energy transfer limits food chain length to 3-4 levels.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-019',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Ecology',
    topic: 'Biogeochemical Cycles',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Nitrogen fixation requires:',
    options: [
      { id: 'a', text: 'Oxygen' },
      { id: 'b', text: 'Nitrogenase enzyme' },
      { id: 'c', text: 'Sunlight' },
      { id: 'd', text: 'Carbon dioxide' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Nitrogenase converts N2 to NH3',
        'Found in nitrogen-fixing bacteria',
        'Requires anaerobic conditions and ATP'
      ],
      explanation: 'Nitrogenase is the key enzyme for biological nitrogen fixation.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-020',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Ecology',
    topic: 'Population',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Carrying capacity of environment is denoted by:',
    options: [
      { id: 'a', text: 'r' },
      { id: 'b', text: 'K' },
      { id: 'c', text: 'N' },
      { id: 'd', text: 'e' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'K = carrying capacity',
        'Maximum population environment can sustain',
        'Limited by resources'
      ],
      explanation: 'K represents the upper limit of population growth.'
    },
    source: 'NEET Style',
    year: 2023
  },

  // EVOLUTION (4 questions)
  {
    questionId: 'BIO-021',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Evolution',
    topic: 'Origin of Life',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'The theory of chemical evolution was proposed by:',
    options: [
      { id: 'a', text: 'Darwin' },
      { id: 'b', text: 'Lamarck' },
      { id: 'c', text: 'Oparin and Haldane' },
      { id: 'd', text: 'Mendel' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Oparin and Haldane (1920s)',
        'Life arose from simple inorganic molecules',
        'Primordial soup hypothesis'
      ],
      explanation: 'Oparin-Haldane hypothesis explains abiogenesis through chemical evolution.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-022',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Evolution',
    topic: 'Natural Selection',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'The book "Origin of Species" was written by:',
    options: [
      { id: 'a', text: 'Lamarck' },
      { id: 'b', text: 'Darwin' },
      { id: 'c', text: 'Mendel' },
      { id: 'd', text: 'Wallace' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Charles Darwin published in 1859',
        'Proposed natural selection',
        'Survival of the fittest'
      ],
      explanation: 'Darwin theory of evolution by natural selection revolutionized biology.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-023',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Evolution',
    topic: 'Homology',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Analogous organs indicate:',
    options: [
      { id: 'a', text: 'Common ancestry' },
      { id: 'b', text: 'Convergent evolution' },
      { id: 'c', text: 'Divergent evolution' },
      { id: 'd', text: 'No evolution' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Analogous organs: similar function, different origin',
        'Wings of bird and insect',
        'Evolved independently for similar purpose'
      ],
      explanation: 'Convergent evolution produces analogous structures in unrelated species.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-024',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Evolution',
    topic: 'Hardy-Weinberg',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Hardy-Weinberg equilibrium requires:',
    options: [
      { id: 'a', text: 'Natural selection' },
      { id: 'b', text: 'Random mating' },
      { id: 'c', text: 'Mutations' },
      { id: 'd', text: 'Small population' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Conditions: large population, random mating',
        'No mutation, selection, or migration',
        'Gene frequencies remain constant'
      ],
      explanation: 'Hardy-Weinberg equilibrium is maintained when there is no evolution.'
    },
    source: 'NEET Style',
    year: 2023
  },

  // BIOTECHNOLOGY (4 questions)
  {
    questionId: 'BIO-025',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Biotechnology',
    topic: 'Genetic Engineering',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Restriction enzymes are called molecular scissors because they:',
    options: [
      { id: 'a', text: 'Synthesize DNA' },
      { id: 'b', text: 'Cut DNA at specific sites' },
      { id: 'c', text: 'Join DNA fragments' },
      { id: 'd', text: 'Copy DNA' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Restriction enzymes recognize specific sequences',
        'They cut DNA at these restriction sites',
        'Creates sticky or blunt ends'
      ],
      explanation: 'Restriction enzymes are essential tools for cutting DNA in genetic engineering.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-026',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Biotechnology',
    topic: 'PCR',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'PCR is used for:',
    options: [
      { id: 'a', text: 'Protein synthesis' },
      { id: 'b', text: 'DNA amplification' },
      { id: 'c', text: 'RNA transcription' },
      { id: 'd', text: 'Cell division' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'PCR = Polymerase Chain Reaction',
        'Amplifies specific DNA sequences',
        'Uses thermal cycling and Taq polymerase'
      ],
      explanation: 'PCR can make millions of copies of DNA from a small sample.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-027',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Biotechnology',
    topic: 'Vectors',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'The most commonly used vector in rDNA technology is:',
    options: [
      { id: 'a', text: 'Virus' },
      { id: 'b', text: 'Plasmid' },
      { id: 'c', text: 'Chromosome' },
      { id: 'd', text: 'Mitochondria' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Plasmids are small circular DNA',
        'Found in bacteria',
        'Easy to manipulate and replicate'
      ],
      explanation: 'Plasmids like pBR322 and pUC are common cloning vectors.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-028',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Biotechnology',
    topic: 'Transgenic Organisms',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Bt cotton contains gene from:',
    options: [
      { id: 'a', text: 'Agrobacterium' },
      { id: 'b', text: 'Bacillus thuringiensis' },
      { id: 'c', text: 'E. coli' },
      { id: 'd', text: 'Tobacco plant' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Bt = Bacillus thuringiensis',
        'cry gene produces Bt toxin',
        'Kills cotton bollworm larvae'
      ],
      explanation: 'Bt cotton is resistant to bollworm due to bacterial toxin gene.'
    },
    source: 'NEET Style',
    year: 2023
  },

  // REPRODUCTION (4 questions)
  {
    questionId: 'BIO-029',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Reproduction',
    topic: 'Human Reproduction',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Fertilization in humans occurs in:',
    options: [
      { id: 'a', text: 'Uterus' },
      { id: 'b', text: 'Ovary' },
      { id: 'c', text: 'Fallopian tube' },
      { id: 'd', text: 'Vagina' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Egg released from ovary enters fallopian tube',
        'Sperm meets egg in ampulla',
        'Fertilization forms zygote'
      ],
      explanation: 'Ampulla of fallopian tube is the site of fertilization.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-030',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Reproduction',
    topic: 'Plant Reproduction',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Double fertilization is characteristic of:',
    options: [
      { id: 'a', text: 'Gymnosperms' },
      { id: 'b', text: 'Angiosperms' },
      { id: 'c', text: 'Pteridophytes' },
      { id: 'd', text: 'Bryophytes' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'One sperm fuses with egg → zygote',
        'Other sperm fuses with polar nuclei → endosperm',
        'Unique to flowering plants'
      ],
      explanation: 'Double fertilization produces both embryo and nutritive endosperm.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-031',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Reproduction',
    topic: 'Menstrual Cycle',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Ovulation occurs on approximately day:',
    options: [
      { id: 'a', text: '1-5' },
      { id: 'b', text: '14' },
      { id: 'c', text: '21' },
      { id: 'd', text: '28' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'LH surge triggers ovulation',
        'Occurs around day 14 of 28-day cycle',
        'Mature egg released from ovary'
      ],
      explanation: 'Ovulation marks the middle of menstrual cycle.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-032',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Reproduction',
    topic: 'Embryology',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Implantation of embryo occurs in:',
    options: [
      { id: 'a', text: 'Ovary' },
      { id: 'b', text: 'Fallopian tube' },
      { id: 'c', text: 'Endometrium of uterus' },
      { id: 'd', text: 'Cervix' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Blastocyst reaches uterus around day 7',
        'Implants in endometrium',
        'Begins formation of placenta'
      ],
      explanation: 'Endometrium provides nutrition and support for developing embryo.'
    },
    source: 'NEET Style',
    year: 2023
  },

  // ANIMAL KINGDOM (4 questions)
  {
    questionId: 'BIO-033',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Animal Kingdom',
    topic: 'Classification',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Animals with notochord are called:',
    options: [
      { id: 'a', text: 'Non-chordates' },
      { id: 'b', text: 'Chordates' },
      { id: 'c', text: 'Invertebrates' },
      { id: 'd', text: 'Arthropods' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Notochord is a rod-like structure',
        'Present at some stage of life',
        'Characteristic of phylum Chordata'
      ],
      explanation: 'Chordates include all vertebrates and some invertebrates with notochord.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-034',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Animal Kingdom',
    topic: 'Arthropods',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Insects have how many pairs of legs?',
    options: [
      { id: 'a', text: '2 pairs' },
      { id: 'b', text: '3 pairs' },
      { id: 'c', text: '4 pairs' },
      { id: 'd', text: '5 pairs' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Insects have 6 legs (3 pairs)',
        'Also have 3 body segments',
        'Most have wings'
      ],
      explanation: 'Six legs is a defining characteristic of class Insecta.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-035',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Animal Kingdom',
    topic: 'Vertebrates',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'Which group has four-chambered heart?',
    options: [
      { id: 'a', text: 'Fishes' },
      { id: 'b', text: 'Amphibians' },
      { id: 'c', text: 'Reptiles' },
      { id: 'd', text: 'Mammals' }
    ],
    correctAnswer: 'd',
    solution: {
      steps: [
        'Mammals and birds have 4-chambered hearts',
        'Complete separation of oxygenated and deoxygenated blood',
        'More efficient for endotherms'
      ],
      explanation: 'Four-chambered heart prevents mixing of blood.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-036',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Animal Kingdom',
    topic: 'Symmetry',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Bilateral symmetry is found in:',
    options: [
      { id: 'a', text: 'Starfish' },
      { id: 'b', text: 'Jellyfish' },
      { id: 'c', text: 'Humans' },
      { id: 'd', text: 'Hydra' }
    ],
    correctAnswer: 'c',
    solution: {
      steps: [
        'Bilateral: body divisible into equal halves by one plane',
        'Humans have left-right symmetry',
        'Starfish and jellyfish have radial symmetry'
      ],
      explanation: 'Most actively moving animals show bilateral symmetry.'
    },
    source: 'NEET Style',
    year: 2023
  },

  // PLANT KINGDOM (4 questions)
  {
    questionId: 'BIO-037',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Plant Kingdom',
    topic: 'Algae',
    difficulty: 'easy',
    questionType: 'single-correct',
    questionText: 'Algae are classified based on:',
    options: [
      { id: 'a', text: 'Size only' },
      { id: 'b', text: 'Pigments and stored food' },
      { id: 'c', text: 'Habitat only' },
      { id: 'd', text: 'Number of cells' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Chlorophyceae: green, store starch',
        'Phaeophyceae: brown, store laminarin',
        'Rhodophyceae: red, store floridean starch'
      ],
      explanation: 'Pigment composition determines the color and classification of algae.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-038',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Plant Kingdom',
    topic: 'Bryophytes',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Bryophytes are called amphibians of plant kingdom because:',
    options: [
      { id: 'a', text: 'They live in water only' },
      { id: 'b', text: 'They need water for reproduction' },
      { id: 'c', text: 'They are fully terrestrial' },
      { id: 'd', text: 'They have vascular tissue' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Live on land but need water for fertilization',
        'Sperm swims to egg',
        'Dependent on water like amphibians'
      ],
      explanation: 'Bryophytes complete life cycle partly in water and partly on land.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-039',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Plant Kingdom',
    topic: 'Pteridophytes',
    difficulty: 'hard',
    questionType: 'single-correct',
    questionText: 'First vascular plants are:',
    options: [
      { id: 'a', text: 'Bryophytes' },
      { id: 'b', text: 'Pteridophytes' },
      { id: 'c', text: 'Gymnosperms' },
      { id: 'd', text: 'Angiosperms' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Pteridophytes have xylem and phloem',
        'First plants with vascular tissue',
        'Examples: ferns, horsetails'
      ],
      explanation: 'Evolution of vascular tissue was a major step in plant evolution.'
    },
    source: 'NEET Style',
    year: 2023
  },
  {
    questionId: 'BIO-040',
    exam: 'NEET',
    subject: 'biology',
    chapter: 'Plant Kingdom',
    topic: 'Angiosperms',
    difficulty: 'medium',
    questionType: 'single-correct',
    questionText: 'Angiosperms are characterized by:',
    options: [
      { id: 'a', text: 'Naked seeds' },
      { id: 'b', text: 'Covered seeds (fruits)' },
      { id: 'c', text: 'No flowers' },
      { id: 'd', text: 'Absence of xylem' }
    ],
    correctAnswer: 'b',
    solution: {
      steps: [
        'Angio = covered, sperm = seed',
        'Seeds enclosed in fruits',
        'Most diverse plant group'
      ],
      explanation: 'Angiosperms have flowers and produce seeds enclosed within fruits.'
    },
    source: 'NEET Style',
    year: 2023
  }
];

export async function POST(req: NextRequest) {
  try {
    const batch = adminDb.batch();
    let count = 0;

    // Clear existing questions
    const existing = await adminDb.collection('questions').limit(500).get();
    existing.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();

    // Add new questions in batches (Firestore limit is 500 per batch)
    const batchSize = 450;
    for (let i = 0; i < QUESTIONS.length; i += batchSize) {
      const batch2 = adminDb.batch();
      const chunk = QUESTIONS.slice(i, i + batchSize);
      
      for (const q of chunk) {
        const ref = adminDb.collection('questions').doc(q.questionId);
        batch2.set(ref, {
          ...q,
          isActive: true,
          attemptCount: 0,
          correctCount: 0,
          createdAt: new Date(),
        });
        count++;
      }
      await batch2.commit();
    }

    return NextResponse.json({
      success: true,
      message: `✅ Seeded ${count} questions successfully!`,
      breakdown: {
        physics: QUESTIONS.filter(q => q.subject === 'physics').length,
        chemistry: QUESTIONS.filter(q => q.subject === 'chemistry').length,
        mathematics: QUESTIONS.filter(q => q.subject === 'mathematics').length,
        biology: QUESTIONS.filter(q => q.subject === 'biology').length,
      }
    });
  } catch (err: any) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
