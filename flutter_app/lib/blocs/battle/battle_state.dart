import 'package:equatable/equatable.dart';

enum BattleStatus { initial, inProgress, finished, error, unauthorized }

class BattleState extends Equatable {
  final BattleStatus status;
  final double myHp;
  final double opponentHp;
  final String? myPokemonName;
  final String? opponentPokemonName;
  final String? myPokemonGraphicUrl;
  final String? opponentPokemonGraphicUrl;
  final int myRemainingPokemons;
  final int opponentRemainingPokemons;
  final bool attackEnabled;
  final bool shouldExit;
  final String? message;

  const BattleState({
    this.status = BattleStatus.initial,
    this.myHp = 1.0,
    this.opponentHp = 1.0,
    this.myPokemonName,
    this.opponentPokemonName,
    this.myPokemonGraphicUrl,
    this.opponentPokemonGraphicUrl,
    this.myRemainingPokemons = 0,
    this.opponentRemainingPokemons = 0,
    this.attackEnabled = false,
    this.shouldExit = false,
    this.message,
  });

  BattleState copyWith({
    BattleStatus? status,
    double? myHp,
    double? opponentHp,
    String? myPokemonName,
    String? opponentPokemonName,
    String? myPokemonGraphicUrl,
    String? opponentPokemonGraphicUrl,
    int? myRemainingPokemons,
    int? opponentRemainingPokemons,
    bool? attackEnabled,
    bool? shouldExit,
    String? message,
  }) {
    return BattleState(
      status: status ?? this.status,
      myHp: myHp ?? this.myHp,
      opponentHp: opponentHp ?? this.opponentHp,
      myPokemonName: myPokemonName ?? this.myPokemonName,
      opponentPokemonName: opponentPokemonName ?? this.opponentPokemonName,
      myPokemonGraphicUrl: myPokemonGraphicUrl ?? this.myPokemonGraphicUrl,
      opponentPokemonGraphicUrl:
          opponentPokemonGraphicUrl ?? this.opponentPokemonGraphicUrl,
      myRemainingPokemons: myRemainingPokemons ?? this.myRemainingPokemons,
      opponentRemainingPokemons:
          opponentRemainingPokemons ?? this.opponentRemainingPokemons,
      attackEnabled: attackEnabled ?? this.attackEnabled,
      shouldExit: shouldExit ?? this.shouldExit,
      message: message, // Allow setting to null to clear snackbar
    );
  }

  @override
  List<Object?> get props => [
    status,
    myHp,
    opponentHp,
    myPokemonName,
    opponentPokemonName,
    myPokemonGraphicUrl,
    opponentPokemonGraphicUrl,
    myRemainingPokemons,
    opponentRemainingPokemons,
    attackEnabled,
    shouldExit,
    message,
  ];
}
