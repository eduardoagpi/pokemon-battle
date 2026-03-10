import 'dart:math';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'battle_event.dart';
import 'battle_state.dart';

class BattleBloc extends Bloc<BattleEvent, BattleState> {
  BattleBloc() : super(const BattleState()) {
    on<StartBattle>(_onStartBattle);
    on<Attack>(_onAttack);
    on<ExitFight>(_onExitFight);
  }

  void _onStartBattle(StartBattle event, Emitter<BattleState> emit) {
    emit(
      state.copyWith(
        status: BattleStatus.inProgress,
        myHp: 1.0,
        opponentHp: 1.0,
      ),
    );
  }

  void _onAttack(Attack event, Emitter<BattleState> emit) async {
    if (state.status != BattleStatus.inProgress) return;

    // My attack
    final myDamage = Random().nextDouble() * 0.2 + 0.1;
    final newOpponentHp = max(0.0, state.opponentHp - myDamage);

    emit(
      state.copyWith(
        opponentHp: newOpponentHp,
        message:
            'You attacked for ${(myDamage * 100).toStringAsFixed(0)}% damage!',
      ),
    );

    if (newOpponentHp <= 0) {
      emit(
        state.copyWith(
          status: BattleStatus.finished,
          message: 'You won the battle!',
        ),
      );
      return;
    }

    // Opponent attack after a short delay
    await Future.delayed(const Duration(milliseconds: 500));

    final opponentDamage = Random().nextDouble() * 0.15 + 0.05;
    final newMyHp = max(0.0, state.myHp - opponentDamage);

    emit(
      state.copyWith(
        myHp: newMyHp,
        message:
            'Opponent attacked for ${(opponentDamage * 100).toStringAsFixed(0)}% damage!',
      ),
    );

    if (newMyHp <= 0) {
      emit(
        state.copyWith(
          status: BattleStatus.finished,
          message: 'You lost the battle!',
        ),
      );
    }
  }

  void _onExitFight(ExitFight event, Emitter<BattleState> emit) {
    emit(
      state.copyWith(status: BattleStatus.finished, message: 'You ran away!'),
    );
  }
}
