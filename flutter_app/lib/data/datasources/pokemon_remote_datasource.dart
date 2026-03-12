import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/pokemon_model.dart';
import '../../domain/repositories/general_repository.dart';

class PokemonRemoteDataSource {
  final GeneralRepository generalRepository;
  final http.Client client;

  PokemonRemoteDataSource({
    required this.generalRepository,
    http.Client? client,
  }) : client = client ?? http.Client();

  String get _baseUrl {
    final savedUrl = generalRepository.getApiUrl();
    if (savedUrl != null && savedUrl.isNotEmpty) {
      return savedUrl;
    }
    return const String.fromEnvironment('WEB_FLUTTER_INITIAL_API_URL');
  }

  Future<List<PokemonListItemResponse>> getPokemonList() async {
    final response = await client.get(Uri.parse('$_baseUrl/list'));

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = json.decode(response.body);
      return jsonList
          .map((json) => PokemonListItemResponse.fromJson(json))
          .toList();
    } else {
      throw Exception('Failed to load pokemon list');
    }
  }

  Future<PokemonResponse> getPokemonDetails(int id) async {
    final response = await client.get(Uri.parse('$_baseUrl/list/$id'));

    if (response.statusCode == 200) {
      final dynamic jsonMap = json.decode(response.body);
      return PokemonResponse.fromJson(jsonMap);
    } else {
      throw Exception('Failed to load pokemon details for id $id');
    }
  }
}
