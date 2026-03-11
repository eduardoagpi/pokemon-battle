import '../../domain/entities/pokemon.dart';
import '../../domain/repositories/pokemon_repository.dart';
import '../datasources/pokemon_remote_datasource.dart';

class PokemonRepositoryImpl implements PokemonRepository {
  final PokemonRemoteDataSource remoteDataSource;

  PokemonRepositoryImpl({required this.remoteDataSource});

  @override
  Future<List<PokemonListItem>> getPokemonList() async {
    final response = await remoteDataSource.getPokemonList();
    return response.map((item) => item.toDomain()).toList();
  }

  @override
  Future<Pokemon> getPokemonDetails(int id) async {
    final response = await remoteDataSource.getPokemonDetails(id);
    return response.toDomain();
  }
}
